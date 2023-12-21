"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email"),
  message: z.string().min(1, { message: "Message is required" }),
});

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const handleSubmission = () => formRef.current?.submit();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form
        className="flex flex-col gap-4 max-w-xl w-full"
        onSubmit={handleSubmit(handleSubmission)}
        ref={formRef}
        action={process.env.NEXT_PUBLIC_FORMIE_ENDPOINT}
        method="post"
      >
        <input
          id="email"
          type="email"
          className="border"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-red-500">
            {errors.email.message?.toString()}
          </span>
        )}
        <textarea id="message" className="border" {...register("message")} />
        {errors.message && (
          <span className="text-red-500">
            {errors.message.message?.toString()}
          </span>
        )}
        <button type="submit" className="border">
          Submit
        </button>
      </form>
    </main>
  );
}
