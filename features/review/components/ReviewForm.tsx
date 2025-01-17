"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import ReviewInsert from "@/app/api/review/ReviewInsert";
import { Reservation } from "@/app/lib/types/types";

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
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@mui/material";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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
  image: z
    .any()
    .refine(
      (file) => file instanceof File, // Ensure it's a valid File object
      "Invalid file type."
    )
    .refine(
      (file) => file && file.size <= MAX_FILE_SIZE, // Ensure size is within the limit
      `Max image size is 5MB.`
    )
    .refine(
      (file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type), // Ensure the file type is valid
      "Only .jpg, .jpeg, .png, and .webp formats are supported."
    )
    .refine(
      (file) =>
        file &&
        file instanceof File &&
        file.size <= MAX_FILE_SIZE &&
        ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Invalid image file."
    )
    .refine(
      (file) =>
        file &&
        file instanceof File &&
        file.size <= MAX_FILE_SIZE &&
        ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only one image can be uploaded."
    )
    .optional(),
  tnc: z.literal(true, {
    errorMap: () => ({
      message: "Accepting the terms and condition is required!",
    }),
  }),
});

const ReviewForm = ({ reservation }: { reservation: Reservation | null }) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [message, setMessage] = useState<string>("Submit");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: reservation?.firstName,
      lastName: reservation?.lastName,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmit(true);
      setMessage("Submitting your review...");

      if (values.image) {
        const formData = new FormData();
        formData.append("image", values.image);
        formData.append(
          "author",
          `${reservation?.firstName + " " + reservation?.lastName}`
        );

        const res = await fetch("/api/image", {
          method: "POST",
          body: formData,
        });

        await res.json();
      }

      const uuid = uuidv4().slice(0, 13).toUpperCase();

      if (values && reservation) {
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
          status: "pending",
          reservationId: reservation.reservationId,
        };

        await ReviewInsert(data);
        setMessage("Email Sent!");
      }
    } catch (error) {
      setIsSubmit(false);
      setMessage("Review Submission Failed");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="col-span-1 space-y-5 bg-white md:h-screen order-2"
      >
        <h1 className="text-lg font-bold border-b border-gray-500 px-10 py-5">
          Review Form
        </h1>
        <section className="space-y-5 bg-white px-5 md:px-10 pb-10 md:pt-5">
          <div className="grid space-y-4 md:space-y-0 md:grid-cols-2 md:gap-x-4 border-b border-gray-300 pb-5">
            {/* First name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={true}
                      value={reservation?.firstName}
                    />
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
                    <Input
                      {...field}
                      disabled={true}
                      value={reservation?.lastName}
                    />
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

          {/* Image */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image to share</FormLabel>
                <FormControl className="text-start">
                  <Input
                    id="picture"
                    type="file"
                    accept="image/jpeg, image/jpg, image/png, image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file); // Pass the selected file to React Hook Form
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Note: This is optional.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl className="text-start">
                  <Textarea
                    placeholder="Enter your message here."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <span className="underline font-semibold text-black">
                      Terms of submitting a review
                    </span>
                    .{" "}
                  </FormLabel>
                  <FormDescription>
                    Please read the following terms of submitting a review
                    carefully before proceeding with your review.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmit}>
            {message}
          </Button>
        </section>
      </form>
    </Form>
  );
};

export default ReviewForm;
