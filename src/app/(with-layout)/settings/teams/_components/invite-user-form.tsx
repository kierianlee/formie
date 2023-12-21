"use client";

import { inviteUserToTeam } from "@/actions/invite-user-to-team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

interface InviteUserFormProps {
  teamId: string;
}

const InviteUserForm = ({ teamId }: InviteUserFormProps) => {
  const inviteUserToTeamWithId = inviteUserToTeam.bind(null, teamId);

  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        setSubmitting(true);
        try {
          await inviteUserToTeamWithId(new FormData(e.currentTarget));
          toast.success("Team member invited");
          setValue("");
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message);
          } else {
            toast.error("Couldn't invite team member");
          }
        }
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
