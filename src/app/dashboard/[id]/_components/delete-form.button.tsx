"use client";

import { deleteForm } from "@/actions/delete-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

interface DeleteFormButtonProps {
  formId: string;
}

export function DeleteFormButton({ formId }: DeleteFormButtonProps) {
  const deleteFormWithId = deleteForm.bind(null, formId);
  const [submitting, setSubmitting] = useState(false);

  return (
    <button
      type="submit"
      disabled={submitting}
      aria-disabled={submitting}
      className="flex items-center gap-4 text-xs text-red-400"
      onClick={async () => {
        setSubmitting(true);
        try {
          await deleteFormWithId();
          toast.success("Form deleted");
        } catch (err) {
          toast.error("Couldn't delete form");
        }
        setSubmitting(false);
      }}
    >
      <span>Delete form</span>
      {submitting && (
        <TailSpin
          height="20"
          width="20"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
        />
      )}
    </button>
  );
}
