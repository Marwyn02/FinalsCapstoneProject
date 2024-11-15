"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export default function SignIn() {
  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
        }),
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5">
      <h1 className="text-2xl font-bold">Signin Form</h1>

      <div className="grid grid-cols-1 space-y-8 mt-5">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label>First name</label>
          <Input
            {...register("firstName", { required: true })}
            type="text"
            placeholder="Enter your first name"
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label>Last name</label>
          <Input
            {...register("lastName", { required: true })}
            type="text"
            placeholder="Enter your last name"
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label>Email address</label>
          <Input
            {...register("email", { required: true })}
            type="email"
            placeholder="@email"
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label>Password</label>
          <Input
            {...register("password", { required: true, minLength: 6 })}
            type="password"
            placeholder="*"
          />
        </div>
      </div>

      <Button type="submit" className="mt-10">
        Submit
      </Button>
    </form>
  );
}
