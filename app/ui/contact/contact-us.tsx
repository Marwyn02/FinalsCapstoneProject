"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ParallaxBanner } from "react-scroll-parallax";
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

export function ContactPage() {
  return (
    <div>
      <ParallaxBanner
        layers={[{ image: "/image/room-2-1.jpg", speed: -15 }]}
        className="w-full h-[300px] object-cover brightness-75 contrast-125"
      />

      <section className="grid grid-cols-2 gap-x-5">
        {/* Contact title */}
        <div className="space-y-5 ml-28 py-10">
          <div>
            <h1 className="text-6xl font-semibold font-teko">Contact us</h1>
            <p className="font-semibold">Get in Touch with Us</p>
          </div>

          <p>
            We’re here to help! Whether you have a question about our services,
            need assistance with a booking, or want to share feedback, feel free
            to reach out. Simply fill out the form below and a member of our
            team will get back to you as soon as possible. We aim to respond to
            all inquiries within 24 hours. We value your thoughts and look
            forward to assisting you!
            <br />
            <br />
            We value your thoughts and look forward to assisting you!
          </p>

          <div>
            <p className="font-medium font-teko">Our email address:</p>
            <p className="font-semibold">crisantotransienthouse@gmail.com</p>
          </div>
        </div>

        {/* Contact form */}
        <ContactForm />
      </section>
    </div>
  );
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string(),
  subject: z.string(),
  message: z.string(),
});

export function ContactForm() {
  const router = useRouter();
  const [isSubmit, setIsSubmit] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmit(true);

      console.log(values);

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 bg-white p-10 pr-28"
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
          Submit
        </Button>
      </form>
    </Form>
  );
}
