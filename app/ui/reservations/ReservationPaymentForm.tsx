"use client";

import React, { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useStore from "@/app/store/store";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { LoaderCircle } from "lucide-react";
import { createReservation } from "@/app/api/reservation/route";
import { TokenConfirmation } from "@/app/api/confirmation/TokenConfirmation";
import { EmailSender } from "@/app/utils/EmailSender";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GcashReservation = {
  prefix: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  modeOfPayment: string;
  payment: string;
  reservationId: string;
  adult: string;
  children: string;
  checkIn: string;
  checkOut: string;
  nights?: number;
  status: string;
};

const formSchema = z.object({
  prefix: z.string({ message: "Must choose your prefix." }),
  firstName: z
    .string({
      required_error: "We need your first name!",
      invalid_type_error: "Your first name is really a number?",
    })
    .min(1, { message: "First name is required!" }),
  lastName: z
    .string({
      required_error: "Also your last name please!",
      invalid_type_error: "Also your last name?",
    })
    .min(1, { message: "Last name must be at least 1 character." }),
  email: z
    .string({
      required_error: "Any idea how can we send you an email?, so enter it!",
    })
    .email({ message: "We don't take that kind of email address." }),
  contactNumber: z
    .string({ required_error: "Phone number is required!" })
    .min(11, { message: "Phone number must be exactly 11 digits" })
    .max(11, { message: "Phone number must be exactly 11 digits" })
    .regex(/^09\d+$/, {
      message: "Phone number must start with '09' and contain only numbers",
    }),
  tnc: z.literal(true, {
    errorMap: () => ({
      message: "Accepting the terms and condition is required!",
    }),
  }),
});

const ReservationPaymentForm = () => {
  const {
    checkInDate,
    checkOutDate,
    adultNumberGuest,
    childrenNumberGuest,
    bookingTotalPrice,
    setId,
    setPrefix,
    setFirstName,
    setLastName,
    setEmail,
    setPhoneNumber,
    setModeOfPayment,
  } = useStore();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const [payment, setPayment] = useState<string>("Cash");
  const [isCOA, setIsCOA] = useState<boolean>(true);
  const [isOnlinePayment, setIsOnlinePayment] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const publicKey = process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const createSource = async ({
    reservationId,
    name,
    phone,
    email,
  }: {
    reservationId: string;
    name: string;
    phone: string;
    email: string;
  }) => {
    const reservationHalfPrice = bookingTotalPrice / 2;
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(publicKey!).toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: reservationHalfPrice * 100,
            redirect: {
              success: `${baseUrl}/reservation-success/${reservationId}`,
              failed: `${baseUrl}`,
            },
            billing: { name: `${name}`, phone: `${phone}`, email: `${email}` },
            type: "gcash",
            currency: "PHP",
          },
        },
      }),
    };
    return fetch("https://api.paymongo.com/v1/sources", options)
      .then((response) => response.json())
      .then((response) => {
        console.log("Source: ", response);
        return response;
      })
      .catch((err) => console.error(err));
  };

  // Function to Listen to the Source in the Front End
  const listenToPayment = async (
    sourceId: string,
    gcashValues: GcashReservation
  ) => {
    const checkInterval = 1000;
    let remainingAttempts = 10;

    while (remainingAttempts > 0) {
      await new Promise((resolve) => setTimeout(resolve, checkInterval));

      try {
        // Fetch the source data
        const response = await fetch(
          "https://api.paymongo.com/v1/sources/" + sourceId,
          {
            headers: {
              Authorization: `Basic ${Buffer.from(publicKey!).toString(
                "base64"
              )}`,
            },
          }
        );
        const sourceData = await response.json();

        if (sourceData.data.attributes.status === "failed") {
          console.log("Payment Failed");
          console.log(sourceData);
          break;
        } else if (sourceData.data.attributes.status === "paid") {
          console.log("Payment Success");
          console.log("Values: ", gcashValues);
          await createReservation(gcashValues);
          await EmailSender({
            email: gcashValues.email,
            name: gcashValues.firstName + " " + gcashValues.lastName,
            link: `${baseUrl}/reservations/receipt/${gcashValues.reservationId}`,
            reservationId: gcashValues.reservationId,
            checkInDate: new Date(checkInDate),
            checkOutDate: new Date(checkOutDate),
            totalPrice: (bookingTotalPrice / 2).toString(),
          });
          console.log("Reservation created successfully.");
          break;
        } else {
          remainingAttempts = 10;
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
      }
      remainingAttempts -= 1;
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (data.tnc !== true) return;

    try {
      setIsSubmit(true);
      const uuid = uuidv4().slice(0, 13).toUpperCase();
      if (data.firstName && data.lastName && data.contactNumber && payment) {
        setId(uuid);
        setPrefix(data.prefix);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setPhoneNumber(data.contactNumber);
        setModeOfPayment(payment);
        // Checkin date is filled
        // Checkout date is filled
        // Adulet is filled
        // Children is filled
        // Payment is filled
      }

      const values = {
        reservationId: uuid,
        prefix: data.prefix,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.contactNumber,
        modeOfPayment: payment,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adult: adultNumberGuest.toString(),
        children: childrenNumberGuest.toString(),
        payment: bookingTotalPrice.toString(),
        status: "pending",
      };

      if (values.modeOfPayment === "Gcash" && bookingTotalPrice > 0) {
        console.log("GCASH =======");

        const fullname = `${data.firstName + " " + data.lastName}`;
        const source = await createSource({
          reservationId: uuid,
          name: fullname,
          phone: data.contactNumber,
          email: data.email,
        });
        const reservationHalfPrice = bookingTotalPrice / 2;
        const gcashValues = {
          reservationId: uuid,
          prefix: data.prefix,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.contactNumber,
          modeOfPayment: payment,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          adult: adultNumberGuest.toString(),
          children: childrenNumberGuest.toString(),
          downpayment: reservationHalfPrice.toString(),
          payment: reservationHalfPrice.toString(),
          status: "confirmed",
        };
        window.open(source.data.attributes.redirect.checkout_url, "_blank");
        listenToPayment(source.data.id, gcashValues);
      }

      if (values.modeOfPayment === "Cash" && bookingTotalPrice > 0) {
        await createReservation(values);
        await TokenConfirmation(data.email);
        setEmailSent(true);
        setIsSubmit(false);
      }

      if (bookingTotalPrice < 0) {
        setTimeout(() => {
          setIsSubmit(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setIsSubmit(false);
    }
  }

  // Handles what payment option the user chooses
  const paymentOptionHandler = (type: string) => {
    if (type === "COA") {
      setIsCOA(true);
      setPayment("Cash");
      setIsOnlinePayment(false);
    } else {
      setIsCOA(false);
      setPayment("Gcash");
      setIsOnlinePayment(true);
    }
  };
  return (
    <Form {...form}>
      <section
        className={`
        ${
          emailSent
            ? "order-1 col-span-1 md:col-span-3"
            : "order-2 col-span-1 md:col-span-3"
        }
        lg:${emailSent ? "order-1" : "order-2"}
      `}
      >
        {emailSent ? (
          <div className="space-y-8 px-5 pt-28 pb-16 md:p-10 bg-[#fcf4e9] md:bg-white border-b-2 border-gray-700">
            <h2 className="text-2xl font-semibold">
              Thank you for your reservation!
            </h2>
            <p>
              A confirmation email has been sent to your email address. Please
              check your email to confirm your reservation.
            </p>
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="order-2 md:order-1 col-span-1 md:col-span-3 space-y-8 px-5 py-10 md:mx-0 md:p-10 bg-white border-b-2 border-gray-700"
          >
            <section>
              <h2 className="font-bold">Personal Details</h2>

              <div className="grid grid-cols-1 gap-2 space-y-3 mt-5">
                {/* Prefix field and First name */}
                <div className="grid grid-cols-3 gap-x-2">
                  <FormField
                    control={form.control}
                    name="prefix"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Prefix</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Prefix" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Mr.">Mr.</SelectItem>
                            <SelectItem value="Mrs.">Mrs.</SelectItem>
                            <SelectItem value="Ms.">Ms.</SelectItem>
                            <SelectItem value="Prefer not to say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Firstname field */}
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Lastname field */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl className="text-start">
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Emailaddress field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phonenumber field */}
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl className="text-start">
                        <Input
                          placeholder="Phone Number"
                          type="text"
                          inputMode="numeric" // Ensures numeric keyboard on mobile devices
                          pattern="[0-9]*" // Prevents non-numeric input
                          maxLength={11}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section>
              <h2 className="font-bold mb-5">Payment Options</h2>
              <div className="flex items-center">
                <Button
                  type="button"
                  className={`${
                    isCOA
                      ? "bg-black text-white"
                      : "bg-transparent text-black border border-gray-800 hover:text-white"
                  }`}
                  onClick={() => paymentOptionHandler("COA")}
                >
                  Cash
                </Button>
                <Button
                  type="button"
                  className={`flex items-center gap-x-1 ${
                    isOnlinePayment
                      ? "bg-black text-white"
                      : "bg-transparent text-black border border-gray-800 hover:text-white"
                  }`}
                  onClick={() => paymentOptionHandler("gcash")}
                >
                  <Image
                    src={"/icon/gcash.svg"}
                    alt="GCash"
                    height={100}
                    width={100}
                    className="h-8 w-8"
                  />
                  <p>GCash</p>
                </Button>
              </div>
            </section>

            {isCOA && (
              <div className="space-y-2 text-sm md:text-base">
                <h4 className="font-medium">
                  Convenient and Flexible Payment Option
                </h4>
                <p className="text-gray-600">
                  Enjoy the ease and flexibility of our full Cash payment
                  option. Upon your arrival at our property, you can settle your
                  reservation fee directly with our friendly staff. This method
                  ensures a seamless check-in experience without the need for
                  prior online transactions
                </p>
              </div>
            )}

            {isOnlinePayment && (
              <section className="space-y-4">
                <div className="bg-gray-50 px-4 py-3 rounded-md">
                  <h2 className="text-xl font-bold mb-4">
                    Downpayment Invoice
                  </h2>

                  <div className="flex justify-between mb-4">
                    <p className="text-gray-700 text-sm">
                      Total Booking Amount
                    </p>
                    <p className="text-gray-700 font-normal">
                      {Number(bookingTotalPrice).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      }) +
                        " " +
                        "PHP"}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-gray-900 font-semibold text-sm">
                      Required Downpayment
                    </p>
                    <p className="text-gray-900 font-semibold text-base md:text-xl">
                      {Number(bookingTotalPrice / 2).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      }) +
                        " " +
                        "PHP"}
                    </p>
                  </div>
                </div>
                <p className="text-[15px]">
                  By clicking "Book Now," you'll be directed to our secure
                  payment gateway to complete your 50% downpayment. Once the
                  payment is confirmed, your reservation will be secured.
                </p>
              </section>
            )}

            <section>
              <FormField
                control={form.control}
                name="tnc"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I have read and agree to the{" "}
                        <a
                          href="https://forms.gle/4EAY31peCk74oqj16"
                          target="_blank"
                          className="underline font-semibold text-black hover:text-blue-600 duration-300"
                        >
                          Terms and Conditions
                        </a>
                        .{" "}
                      </FormLabel>
                      <FormDescription>
                        Please read the following terms and conditions carefully
                        before proceeding with your reservation:
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </section>

            <Button
              type="submit"
              className="flex gap-x-1 w-full md:w-min px-20"
              disabled={isSubmit}
            >
              {isSubmit && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {!isSubmit ? "Book now" : "Processing..."}
            </Button>
          </form>
        )}
      </section>
    </Form>
  );
};

export default ReservationPaymentForm;
