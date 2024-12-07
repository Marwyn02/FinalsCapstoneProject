"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface IFormInput {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    setMessage("Locating your account");

    const response = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (response?.error) {
      setIsLoading(false);
      setMessage("Sign-in failed");
      return;
    }

    setIsLoading(false);
    setMessage("Login Complete");
    router.push("/admin-dashboard");
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="col-start-5 col-span-2 h-screen py-20 px-10 bg-[#fcf4e9]"
    >
      <div className="flex justify-end pb-14">
        <Link
          href={"/"}
          className="flex items-center bg-blue-50 hover:bg-stone-100 duration-300 px-4 py-2 rounded-lg text-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-center">Login</h1>

      <div className="grid grid-cols-1 mt-5 space-y-8">
        <div className="grid w-full items-center gap-1.5">
          <label>Username</label>
          <Input
            {...register("username", { required: true })}
            type="text"
            placeholder="Username"
            disabled={isLoading}
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <label>Password</label>
          <Input
            {...register("password", { required: true })}
            type="password"
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" className="my-5" disabled={isLoading}>
        {!isLoading ? (
          "Login"
        ) : (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        )}
      </Button>

      {message !== "" && (
        <div className="bg-gray-50 rounded-lg text-center px-5 py-4">
          <p>{message}</p>
        </div>
      )}
    </form>
  );
};

export default Login;
