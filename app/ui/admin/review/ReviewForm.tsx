"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@mui/material";
import ReviewInsert from "@/app/api/review/ReviewInsert";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  lastName: z.string(),
  message: z.string(),
  staff: z
    .number()
    .min(0, { message: "Rating must be at least 0" })
    .max(5, { message: "Rating cannot exceed 5" }),
  valueForMoney: z
    .number()
    .min(0, { message: "Rating must be at least 0" })
    .max(5, { message: "Rating cannot exceed 5" }),
  facilities: z
    .number()
    .min(0, { message: "Rating must be at least 0" })
    .max(5, { message: "Rating cannot exceed 5" }),
  cleanliness: z
    .number()
    .min(0, { message: "Rating must be at least 0" })
    .max(5, { message: "Rating cannot exceed 5" }),
  location: z
    .number()
    .min(0, { message: "Rating must be at least 0" })
    .max(5, { message: "Rating cannot exceed 5" }),
  comfort: z
    .number()
    .min(0, { message: "Rating must be at least 0" })
    .max(5, { message: "Rating cannot exceed 5" }),
});

const ReviewForm = () => {
  const [isSubmit, setIsSubmit] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmit(true);

      const uuid = uuidv4().slice(0, 13).toUpperCase();

      if (values.firstName !== "") {
        const data = {
          reviewId: uuid,
          firstName: values.firstName,
          lastName: values.lastName,
          message: values.message,
          staff: values.staff.toString(),
          valueForMoney: values.valueForMoney.toString(),
          facilities: values.facilities.toString(),
          cleanliness: values.cleanliness.toString(),
          location: values.location.toString(),
          comfort: values.comfort.toString(),
        };

        if (data) {
          await ReviewInsert(data);

          setIsSubmit(false);
        }
      }
    } catch (error) {
      console.log(error);

      setIsSubmit(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 bg-white"
      >
        <h1 className="text-lg font-bold border-b border-gray-500 px-10 py-5">
          Review Form
        </h1>
        <section className="space-y-5 bg-white px-10 pb-10 pt-5">
          <div className="grid grid-cols-2 gap-x-4 border-b border-gray-300 pb-5">
            {/* First name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl className="text-start">
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h4 className="font-semibold text-sm">Rating</h4>

          <section className="grid grid-cols-2 gap-x-3 gap-y-6">
            {/* Staff Input */}
            <FormField
              control={form.control}
              name="staff"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Staff</FormLabel>
                  <FormControl className="text-start">
                    <Rating
                      name="half-rating"
                      defaultValue={0}
                      precision={1}
                      size="large"
                      value={field.value}
                      onChange={(event, newValue) => {
                        field.onChange(newValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Value for money */}
            <FormField
              control={form.control}
              name="valueForMoney"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Value for money</FormLabel>
                  <FormControl className="text-start">
                    <Rating
                      name="half-rating"
                      defaultValue={0}
                      precision={1}
                      size="large"
                      value={field.value}
                      onChange={(event, newValue) => {
                        field.onChange(newValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Facilities */}
            <FormField
              control={form.control}
              name="facilities"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Facilities</FormLabel>
                  <FormControl className="text-start">
                    <Rating
                      name="half-rating"
                      defaultValue={0}
                      precision={1}
                      size="large"
                      value={field.value}
                      onChange={(event, newValue) => {
                        field.onChange(newValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cleanliness */}
            <FormField
              control={form.control}
              name="cleanliness"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Cleanliness</FormLabel>
                  <FormControl className="text-start">
                    <Rating
                      name="half-rating"
                      defaultValue={0}
                      precision={1}
                      size="large"
                      value={field.value}
                      onChange={(event, newValue) => {
                        field.onChange(newValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Location</FormLabel>
                  <FormControl className="text-start">
                    <Rating
                      name="half-rating"
                      defaultValue={0}
                      precision={1}
                      size="large"
                      value={field.value}
                      onChange={(event, newValue) => {
                        field.onChange(newValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comfort"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Comfort</FormLabel>
                  <FormControl className="text-start">
                    <Rating
                      name="half-rating"
                      defaultValue={0}
                      precision={1}
                      size="large"
                      value={field.value}
                      onChange={(event, newValue) => {
                        field.onChange(newValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          {/* Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl className="text-start">
                  <Textarea
                    placeholder="Put the message here."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmit}>
            Submit
          </Button>
        </section>
      </form>
    </Form>
  );
};

export default ReviewForm;
