"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { InquiryEmailSender } from "../utils/InquiryEmailSender";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string(),
  subject: z.string(),
  message: z.string(),
});

const ContactForm = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [message, setMessage] = useState("Submit");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmit(true);
      setMessage("Sending");

      if (values) {
        const inquiry = {
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
        };

        const response = await InquiryEmailSender(inquiry);
        if (response) {
          setMessage("Email sent");
        } else {
          setIsSubmit(false);
          setMessage("Sending email failed");
        }
      }
    } catch (error) {
      console.log(error);
      setIsSubmit(false);
      setMessage("Sending email failed");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 bg-white px-5 py-10 md:p-10 md:pr-28"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl className="text-start">
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl className="text-start">
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl className="text-start">
                <Textarea
                  placeholder="You may leave your message here."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmit}>
          {message}
        </Button>

        {message === "Email sent" && (
          <p className="text-[15px] bg-[#dbb07c] p-6">
            Thank you for your inquiry. We have received your message and will
            respond as soon as possible. Please allow us some time to process
            your request. You can expect a reply to your email address within 2
            to 3 business days.
          </p>
        )}
      </form>
    </Form>
  );
};

export default ContactForm;
