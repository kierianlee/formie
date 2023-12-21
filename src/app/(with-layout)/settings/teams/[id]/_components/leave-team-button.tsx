"use client";

import { leaveTeam } from "@/actions/leave-team";
import { Button } from "@/components/ui/button";
import { DoorOpenIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface LeaveTeamButtonProps {
  teamId: string;
}

const LeaveTeamButton = ({ teamId }: LeaveTeamButtonProps) => {
  const leaveTeamWithId = leaveTeam.bind(null, teamId);

  const [loading, setLoading] = useState(false);

  return (
    <Button
      className="bg-red-400 hover:bg-red-500"
      variant="outline"
      disabled={loading}
      aria-disabled={loading}
      onClick={async () => {
        setLoading(true);

        try {
          await leaveTeamWithId();
          toast.success("Left team");
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message);
          } else {
            toast.error("Couldn't leave team");
          }
        }

        setLoading(false);
      }}
    >
      <DoorOpenIcon className="w-4" />
    </Button>
  );
};

export default LeaveTeamButton;
