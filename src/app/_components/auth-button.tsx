"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components//ui/button";
import Link from "next/link";

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
    <Button className="flex w-full gap-2" asChild>
      <Link href="/login">Sign In</Link>
    </Button>
  );
}
