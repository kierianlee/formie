"use client";

import { updateFormRedirectUrl } from "@/actions/update-form-redirect-url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

interface RedirectUrlFormProps {
  formId: string;
  defaultValue?: string;
}

const RedirectUrlForm = ({ formId, defaultValue }: RedirectUrlFormProps) => {
  const updateFormRedirectUrlWithId = updateFormRedirectUrl.bind(null, formId);

  const [value, setValue] = useState(defaultValue);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
          await updateFormRedirectUrlWithId(new FormData(e.currentTarget));
          toast.success("Redirect URL updated");
        } catch (err) {
          toast.error("Couldn't update redirect URL");
        }
        setSubmitting(false);
      }}
      className="flex gap-4"
    >
      <Input
        name="redirectUrl"
        placeholder="Set redirect URL"
        className="flex-1"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      <Button
        variant="secondary"
        disabled={submitting}
        aria-disabled={submitting}
        type="submit"
        className="flex items-center gap-4"
      >
        <span>Save</span>
        {submitting && (
          <TailSpin
            height="16"
            width="16"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
          />
        )}
      </Button>
    </form>
  );
};

export default RedirectUrlForm;
