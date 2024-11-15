"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  username: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        console.log("Signin failed!");
        router.push("/login");
      }

      router.push("/admin-dashboard");
      console.log({ response });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="col-start-5 col-span-2 h-screen py-20 px-10 bg-[#fcf4e9]"
    >
      <h1 className="text-2xl font-bold">Your account</h1>

      <div className="grid grid-cols-1 mt-5 space-y-8">
        <div className="grid w-full items-center gap-1.5">
          <label>Username</label>
          <Input
            {...register("username", { required: true })}
            type="text"
            placeholder="username"
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <label>Password</label>
          <Input
            {...register("password", { required: true, minLength: 6 })}
            type="password"
          />
        </div>
      </div>

      <Button type="submit" className="mt-5">
        Login
      </Button>
    </form>
  );
}
