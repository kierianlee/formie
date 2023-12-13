"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components//ui/button";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button className="w-full" onClick={() => signOut()}>
        Sign out
      </Button>
    );
  }

  return (
    <Button onClick={() => signIn("github")} className="flex w-full gap-2">
      <span>Sign in with GitHub</span>
    </Button>
  );
}
