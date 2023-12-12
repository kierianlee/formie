"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface RedirectUrlFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValue?: string;
}

const RedirectUrlForm = ({ action, defaultValue }: RedirectUrlFormProps) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <form action={action} className="flex gap-4">
      <Input
        name="redirectUrl"
        placeholder="Set redirect URL"
        className="flex-1"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      <Button variant="secondary">Save</Button>
    </form>
  );
};

export default RedirectUrlForm;
