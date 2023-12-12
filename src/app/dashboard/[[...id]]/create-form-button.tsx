"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function CreateFormButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      variant="secondary"
      className="w-full"
    >
      Create new form
    </Button>
  );
}
