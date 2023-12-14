"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

interface SignInButtonProps {
  provider: "google" | "github";
  logoClassName?: string;
  className?: string;
}

const providers = {
  github: {
    name: "GitHub",
    logo: "/github.svg",
  },
  google: {
    name: "Google",
    logo: "/google.svg",
  },
};

const SignInButton = ({
  provider,
  className,
  logoClassName,
}: SignInButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "group flex gap-2 hover:bg-primary hover:text-primary-foreground",
        className,
      )}
      onClick={() => signIn(provider)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={providers[provider].logo}
        className={(cn("w-4"), logoClassName)}
        alt={providers[provider].name}
      />
      <span>Sign in with {providers[provider].name}</span>
    </Button>
  );
};

export default SignInButton;
