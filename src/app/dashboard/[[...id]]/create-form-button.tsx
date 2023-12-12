"use client";

import { createForm } from "@/actions/create-form";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

interface CreateFormButtonProps {
  session: Session;
}

export function CreateFormButton({ session }: CreateFormButtonProps) {
  const createFormWithSession = createForm.bind(null, session);
  const [submitting, setSubmitting] = useState(false);

  return (
    <Button
      type="submit"
      disabled={submitting}
      aria-disabled={submitting}
      variant="secondary"
      className="flex w-full items-center gap-4"
      onClick={async () => {
        setSubmitting(true);
        try {
          await createFormWithSession();
          toast.success("Form created");
        } catch (err) {
          toast.error("Couldn't create form");
        }
        setSubmitting(false);
      }}
    >
      <span>Create new form</span>
      {submitting && (
        <TailSpin
          height="20"
          width="20"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
        />
      )}
    </Button>
  );
}
