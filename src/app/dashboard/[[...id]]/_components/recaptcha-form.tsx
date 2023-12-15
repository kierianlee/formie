"use client";

import { updateFormReCAPTCHAEnabled } from "@/actions/update-form-recaptcha-enabled";
import { updateFormReCAPTCHASecret } from "@/actions/update-form-recaptcha-secret";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

interface RecaptchaFormProps {
  formId: string;
  defaultValue?: string;
  defaultEnabled?: boolean;
}

const RecaptchaForm = ({
  formId,
  defaultValue,
  defaultEnabled,
}: RecaptchaFormProps) => {
  const updateFormReCAPTCHASecretWithId = updateFormReCAPTCHASecret.bind(
    null,
    formId,
  );
  const updateFormReCAPTCHAEnabledWithId = updateFormReCAPTCHAEnabled.bind(
    null,
    formId,
  );

  const [value, setValue] = useState(defaultValue);
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        setSubmitting(true);
        try {
          await updateFormReCAPTCHASecretWithId(new FormData(e.currentTarget));
          toast.success("reCAPTCHA secret updated");
          if (value === "") {
            setEnabled(false);
          }
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message);
          } else {
            toast.error("Couldn't update reCAPTCHA secret");
          }
        }
        setSubmitting(false);
      }}
      className="flex items-center gap-4"
    >
      <Switch
        checked={enabled}
        onCheckedChange={async checked => {
          setEnabled(checked);

          try {
            const formData = new FormData();

            formData.append("enabled", checked ? "true" : "false");

            await updateFormReCAPTCHAEnabledWithId(formData);
            toast.success(checked ? "reCAPTCHA enabled" : "reCAPTCHA disabled");
          } catch (err) {
            setEnabled(!checked);
            if (err instanceof Error) {
              toast.error(err.message);
            } else {
              toast.error("Couldn't update reCAPTCHA status");
            }
          }
        }}
      />
      <Input
        name="secret"
        placeholder="Set reCAPTCHA secret"
        className="flex-1"
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
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

export default RecaptchaForm;
