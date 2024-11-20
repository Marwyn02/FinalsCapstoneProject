"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const formSchema = z.object({
  reservationId: z.string().max(13).optional(),
});

const ReservationSearch = () => {
  const router = useRouter();
  const [isSubmit, setIsSubmit] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reservationId: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmit(true);

      router.push(`/admin-dashboard/reservations/${values.reservationId}`);

      setIsSubmit(false);
    } catch (error) {
      console.log(error);

      setIsSubmit(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white px-8 py-12 space-y-5 h-screen"
      >
        <h1 className="text-3xl font-medium font-teko">
          Find your reservation.
        </h1>
        <FormField
          name="reservationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reservationd Id</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmit} className="w-min px-5">
          Search
        </Button>
      </form>
    </Form>
  );
};

export default ReservationSearch;
