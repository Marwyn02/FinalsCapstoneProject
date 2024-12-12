"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { AccountCreate } from "../api/AccountCreate";

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

const formSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    userName: z.string(),
    email: z.string().email(),
    password: z.string().min(6, {
      message: "Minimum of 6 characters",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum of 6 characters",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

const AccountCreateForm = () => {
  const router = useRouter();

  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmit(true);
    setMessage("Creating admin account...");
    const uuid = uuidv4().toUpperCase();
    if (values && values.userName && values.password) {
      const data = {
        adminId: uuid,
        username: values.userName.toLowerCase(),
        password: values.password,
        email: values.email,
        role: "admin",
      };
      setIsSubmit(false);
      if (data) {
        const response = await AccountCreate(data);
        setIsSubmit(false);
        if (response) {
          if (response.existing) {
            setMessage("Username already exist");
          } else if (!response.success) {
            setMessage("Failed to create an account");
          } else {
            setMessage("Account successfully created");
            setTimeout(() => {
              router.push("/admin-dashboard/account");
            }, 3000);
          }
        } else {
          setMessage("No response from the server");
        }
      }
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white">
        <h1 className="text-2xl font-medium font-teko border-b border-gray-500 px-20 py-5">
          Create account
        </h1>

        <section className="grid grid-cols-2">
          <section className="space-y-5 px-20 py-10 h-full">
            <h2 className="font-bold">Personal Details</h2>
            <div className="grid grid-cols-2 gap-x-5 w-full">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl className="text-start">
                      <Input {...field} disabled={isSubmit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl className="text-start">
                      <Input {...field} disabled={isSubmit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl className="text-start">
                    <Input {...field} type="email" disabled={isSubmit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <hr className="border-black" />

            <h2 className="font-bold">Account Details</h2>
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl className="text-start">
                    <Input {...field} disabled={isSubmit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl className="text-start">
                    <Input {...field} type="password" disabled={isSubmit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl className="text-start">
                    <Input {...field} type="password" disabled={isSubmit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmit}>
              Create Account
            </Button>

            {message !== "" && (
              <div
                className={`p-4 rounded-md font-medium text-center ${
                  message === "Account successfully created"
                    ? "bg-green-500 text-white"
                    : "bg-red-400 text-white"
                }`}
              >
                <p>{message}</p>
              </div>
            )}
          </section>

          {/* This is for the grid design hekhek */}
          <div className="bg-gray-200 h-auto w-full">
            <Image
              src={"/image/LoginImage.jpg"}
              alt=""
              height={1000}
              width={1000}
              className="h-[750px] brightness-95"
            />
          </div>
        </section>
      </form>
    </Form>
  );
};

export default AccountCreateForm;
