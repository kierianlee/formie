"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components//ui/button";
import Link from "next/link";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface AuthButtonProps extends ComponentProps<typeof Button> {}

export default function AuthButton({
  onClick,
  className,
  ...props
}: AuthButtonProps) {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button
        {...props}
        className={cn("w-full", className)}
        onClick={e => {
          signOut();
          onClick?.(e);
        }}
      >
        Sign out
      </Button>
    );
  }

  return (
    <Button
      {...props}
      onClick={onClick}
      className={cn("flex w-full gap-2", className)}
      asChild
    >
      <Link href="/login">Sign In</Link>
    </Button>
  );
}
