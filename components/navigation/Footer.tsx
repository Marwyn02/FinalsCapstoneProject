"use client";

import React, { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SubscribeToNewsletter } from "@/app/api/newsletter/SubscribeToNewsletter";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
  email: z.string().email(),
});

const Footer = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [message, setMessage] = useState("Subscribe");
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmit(true);
    setMessage("Subscribing...");

    if (values.email) {
      const response = await SubscribeToNewsletter(values.email);
      if (response && !response.success) {
        setIsSubmit(response.success);
        setMessage("Subscribing Failed");
        setErrorMessage(response.message);
        setTimeout(() => {
          setMessage("Subscribe");
        }, 3000);
      } else {
        setMessage("Subscribed");
        setErrorMessage(response?.message);
      }
    }
  }
  return (
    <footer className="grid grid-cols-1 lg:grid-cols-3 gap-y-8 md:gap-y-0 text-white px-5 md:px-32 py-9 bg-[#010101]">
      {/* Title and contacts */}
      <div className="space-y-3 col-span-2 md:col-span-1">
        <div>
          {" "}
          <h2 className="text-3xl md:text-xl uppercase font-medium tracking-wide font-teko">
            Crisanto
          </h2>
          <p className="text-xs md:text-[10px] leading-2 md:leading-3 font-light uppercase tracking-widest -mt-1 text-gray-300">
            Transient <br />
            House
          </p>
        </div>

        <div className="text-sm text-gray-300">
          <p className="font-bold">La Union, Philippines</p>
          <p>(+63) 995 488 0496</p>
          <p>(+63) 956 394 3377</p>
          <p>crisantotransienthouse@gmail.com</p>
        </div>
      </div>

      <div className="flex flex-col space-y-2 text-sm text-gray-100">
        <Link href={"/contact"}>Contact</Link>
        <Link href={"/amenities"}>About our house</Link>
        <Link href={"/reservations"}>Reserve</Link>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="text-sm text-gray-200 space-y-2 md:col-start-3 col-span-2 md:col-span-1"
        >
          <div>
            <p className="font-bold">Subscribe to our newsletter</p>
            <div className="grid grid-cols-3 w-full mb-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Email address"
                        type="email"
                        className="bg-transparent placeholder:text-gray-200 border-white text-white active:border-white ring-white focus-visible:border-white"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-[#dbb07c] h-[48px] w-full px-6 text-sm font-semibold text-gray-800 hover:bg-white disabled:text-white"
                disabled={isSubmit}
              >
                {message}
              </Button>
            </div>
            {errorMessage !== "" && (
              <p className="bg-stone-300 p-3.5 text-black">{errorMessage}</p>
            )}
          </div>
        </form>
      </Form>
    </footer>
  );
};

export default Footer;
