"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useStore from "@/app/store/store";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { createReservation } from "@/app/api/reservation/route";

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

  cardNumber: z.string(),
  billingAddress: z.string(),
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

  const [payment, setPayment] = useState<string>("Cash on Arrival");
  const [isCOA, setIsCOA] = useState<boolean>(true);
  const [isOnlinePayment, setIsOnlinePayment] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      billingAddress: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmit(true);

      const uuid = uuidv4().slice(0, 13).toUpperCase();

      if (data.firstName && data.lastName && data.contactNumber && payment) {
        setPrefix(data.prefix);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setPhoneNumber(data.contactNumber);
        setModeOfPayment(payment);
        setId(uuid);
      }

      const values = {
        reservationId: uuid,
        prefix: data.prefix,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        contactNumber: data.contactNumber,
        modeOfPayment: payment,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adult: adultNumberGuest.toString(),
        children: childrenNumberGuest.toString(),
        payment: bookingTotalPrice.toString(),
      };

      if (values) {
        await createReservation(values);
        setIsSubmit(false);
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
      setPayment("Cash on Arrival");
      setIsOnlinePayment(false);
    } else {
      setIsCOA(false);
      setPayment("Online Payment");
      setIsOnlinePayment(true);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mx-5 md:mx-0 md:p-10 bg-white"
      >
        <section>
          <h2 className="font-bold">Guest Information</h2>

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
              Cash on Arrival
            </Button>
            <Button
              type="button"
              className={`${
                isOnlinePayment
                  ? "bg-black text-white"
                  : "bg-transparent text-black border border-gray-800 hover:text-white"
              }`}
              onClick={() => paymentOptionHandler("Online-Payment")}
            >
              Online Payment
            </Button>
          </div>
        </section>

        {isCOA && (
          <div className="space-y-2">
            <h4 className="font-medium">
              Convenient and Flexible Payment Option
            </h4>
            <p className="text-gray-600">
              Enjoy the ease and flexibility of our Cash on Arrival payment
              option. Upon your arrival at our property, you can settle your
              reservation fee directly with our friendly staff. This method
              ensures a seamless check-in experience without the need for prior
              online transactions
            </p>
          </div>
        )}

        {isOnlinePayment && (
          <section>
            <h2 className="font-bold mb-5">Online Payment Information</h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Card Number" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Billing Address"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>
        )}

        <Button type="submit" className="w-min px-20" disabled={isSubmit}>
          {!isSubmit ? "Book now" : "Processing..."}
        </Button>
        {/* <Button type="submit" className="w-min px-20" onClick={thankyou}>
          {!isSubmit ? "Book now" : "Processing..."}
        </Button> */}
      </form>
    </Form>
  );
};

export default ReservationPaymentForm;
