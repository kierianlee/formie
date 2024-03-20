"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

interface InviteUserFormProps {
  teamId: string;
}

const InviteUserForm = ({ teamId }: InviteUserFormProps) => {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        setSubmitting(true);

        const response = await fetch(`/api/teams/invite/${teamId}`, {
          method: "POST",
          body: new FormData(e.currentTarget),
        });

        if (response.status !== 200) {
          toast.error((await response.json()).error.message);
        }

        toast.success("Team member invited");
        setValue("");

        setSubmitting(false);
      }}
      className="flex items-center gap-4"
    >
      <Input
        name="email"
        placeholder="Enter team member's email address"
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
        <span>Invite</span>
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

export default InviteUserForm;
