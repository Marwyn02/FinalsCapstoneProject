/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useStore from "@/app/store/store";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { LoaderCircle } from "lucide-react";
import { ReservationCreate } from "../api/ReservationCreate";
import { EmailSender } from "@/app/utils/EmailSender";
import { SendOTP } from "@/app/api/otp/SendOTP";
import { verifyOTP } from "@/app/api/otp/VerifyOTP";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type GcashReservation = {
  prefix: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  modeOfPayment: string;
  payment: string;
  downpayment: string;
  reservationId: string;
  adult: string;
  children: string;
  pwd: string;
  checkIn: Date;
  checkOut: Date;
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
    .max(40, { message: "Character limit is 40" })
    .min(2, { message: "First name must be at least 2 character." })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message:
        "First name can only contain letters, spaces, hyphens, and apostrophes.",
    }),
  lastName: z
    .string({
      required_error: "Also your last name please!",
      invalid_type_error: "Also your last name?",
    })
    .max(40, { message: "Character limit is 40" })
    .min(2, { message: "Last name must be at least 2 character." })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message:
        "Last name can only contain letters, spaces, hyphens, and apostrophes.",
    }),
  email: z
    .string({
      required_error: "Any idea how can we send you an email?, so enter it!",
    })
    .max(254, { message: "Email address cannot exceed 254 characters." })
    .email({ message: "We don't take that kind of email address." })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message:
        "Email must follow the standard format (e.g., name@example.com).",
    }),
  contactNumber: z
    .string({ required_error: "Phone number is required!" })
    .min(11, { message: "Phone number must be exactly 11 digits" })
    .max(13, {
      message:
        "Phone number cannot exceed 13 characters, including country code.",
    })
    .regex(/^(\+63|09)\d{9}$/, {
      message:
        "Phone number must start with '09' and must contain only numbers.",
    }),
  tnc: z.literal(true, {
    errorMap: () => ({
      message: "Accepting the terms and condition is required!",
    }),
  }),
});

const pinSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const ReservationPaymentForm = () => {
  const {
    checkInDate,
    checkOutDate,
    adultNumberGuest,
    childrenNumberGuest,
    pwdNumberGuest,
    bookingTotalPrice,
  } = useStore();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [otpUiVisible, setOtpUIVisible] = useState(false);
  const [personalDetails, setPersonalDetails] = useState<z.infer<
    typeof formSchema
  > | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const pinForm = useForm<z.infer<typeof pinSchema>>({
    resolver: zodResolver(pinSchema),
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
        return response;
      })
      .catch((err) => console.error(err));
  };

  // Function to Listen to the Source in the Front End
  const listenToPayment = async (
    sourceId: string,
    paymentValues: GcashReservation
  ) => {
    const checkInterval = 10000;
    let remainingAttempts = 10;

    while (remainingAttempts > 0) {
      await new Promise((resolve) => setTimeout(resolve, checkInterval));
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
        break;
      } else if (sourceData.data.attributes.status === "paid") {
        await ReservationCreate(paymentValues);
        await EmailSender({
          email: paymentValues.email,
          name: paymentValues.firstName + " " + paymentValues.lastName,
          link: `${baseUrl}/reservation-success/${paymentValues.reservationId}`,
          reservationId: paymentValues.reservationId,
          checkInDate: new Date(checkInDate),
          checkOutDate: new Date(checkOutDate),
          totalPrice: (bookingTotalPrice / 2).toString(),
        });
        break;
      } else {
        remainingAttempts = 10;
      }
      remainingAttempts -= 1;
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (data.tnc !== true) return;

    setPersonalDetails(data);
    setIsSubmit(true);
    if (data.prefix === "Prefer not to say") {
      const prefix = "";
      data.prefix = prefix;
    }

    // Show OTP Input UI
    setOtpUIVisible(true);

    const otpResponse = await SendOTP(data.email);

    if (!otpResponse.ok) {
      console.error("Failed to send OTP");
      setOtpUIVisible(false);
      return;
    }
    setIsSubmit(false);
  }

  const onPinSubmit = async (data: z.infer<typeof pinSchema>) => {
    setIsSubmit(true);
    if (!personalDetails) {
      return;
    }
    const uuid = uuidv4().slice(0, 13).toUpperCase();
    if (data.pin) {
      const response = await verifyOTP(data.pin);

      if (response) {
        // OTP is valid
        alert("OTP verified successfully!");

        // Check if the user selected GCash as the payment method
        if (bookingTotalPrice > 0) {
          const fullname = `${personalDetails.firstName} ${personalDetails.lastName}`;

          // Create the payment source for PayMongo
          const source = await createSource({
            reservationId: uuid,
            name: fullname,
            phone: personalDetails.contactNumber,
            email: personalDetails.email,
          });

          const isMobile = /iPhone|iPad|iPod|Android/i.test(
            navigator.userAgent
          );

          if (source) {
            const checkoutUrl = source.data.attributes.redirect.checkout_url;

            if (isMobile) {
              // Redirect in the same tab for mobile devices
              window.open(checkoutUrl, "_blank");
            } else {
              // Open the PayMongo checkout URL
              const openPaymongo = window.open(checkoutUrl, "_blank");

              if (!openPaymongo) {
                // Fallback if popup is blocked
                window.location.href = checkoutUrl;
              }
            }

            // Listen to payment status
            await listenToPayment(source.data.id, {
              reservationId: uuid,
              prefix: personalDetails.prefix,
              firstName: personalDetails.firstName,
              lastName: personalDetails.lastName,
              email: personalDetails.email,
              phoneNumber: personalDetails.contactNumber,
              modeOfPayment: "GCash",
              checkIn: new Date(checkInDate),
              checkOut: new Date(checkOutDate),
              adult: adultNumberGuest.toString(),
              children: childrenNumberGuest.toString(),
              pwd: pwdNumberGuest.toString(),
              downpayment: (bookingTotalPrice / 2).toString(),
              payment: (bookingTotalPrice / 2).toString(),
              status: "confirmed",
            });
          }
        }
      }
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
        {otpUiVisible ? (
          <div className="space-y-8 px-5 pt-28 pb-16 md:p-10 bg-[#fcf4e9] md:bg-white border-b-2 border-gray-700">
            <h2 className="text-2xl font-semibold">Confirm your OTP.</h2>
            <p>
              A confirmation OTP has been sent to your email address. Please
              check your email to confirm your OTP.
            </p>

            <Form {...pinForm}>
              <form
                onSubmit={pinForm.handleSubmit(onPinSubmit)}
                className="w-2/3 space-y-6"
              >
                <FormField
                  control={pinForm.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP disabled={isSubmit} maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        Please enter the one-time password sent to your email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmit}>
                  {isSubmit ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="order-2 md:order-1 col-span-1 md:col-span-3 space-y-4 px-5 py-10 md:mx-0 md:p-10 bg-white border-b-2 border-gray-700"
          >
            <section>
              <h2 className="font-bold">Personal Details</h2>

              <div className="grid grid-cols-1 gap-2 space-y-3 mt-5">
                {/* Prefix field and First name */}
                <div className="grid grid-cols-4 gap-x-2">
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
                      <FormItem className="col-span-3">
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
                          inputMode="numeric"
                          pattern="[0-9]*"
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

            <section className="space-y-4">
              <div className="bg-gray-50 px-4 py-3 rounded-md">
                <h2 className="text-xl font-bold mb-4">Downpayment Invoice</h2>

                <div className="flex justify-between mb-5 text-gray-600 text-sm font-normal">
                  <p>Total Booking Amount</p>
                  <p>
                    {Number(bookingTotalPrice).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) +
                      " " +
                      "PHP"}
                  </p>
                </div>

                <div className="flex justify-between text-gray-900 font-bold">
                  <p className="text-sm">Required Downpayment</p>
                  <p className="text-base md:text-xl">
                    {Number(bookingTotalPrice / 2).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) +
                      " " +
                      "PHP"}
                  </p>
                </div>
              </div>
              <p className="text-[15px]">
                By clicking "Book Now," you'll be directed to our secure payment
                gateway to complete your 50% downpayment. Once the payment is
                confirmed, your reservation will be secured.
              </p>
            </section>

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
