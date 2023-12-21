"use client";

import { deleteTeam } from "@/actions/delete-team";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteTeamButtonProps {
  teamId: string;
}

const DeleteTeamButton = ({ teamId }: DeleteTeamButtonProps) => {
  const deleteTeamWithId = deleteTeam.bind(null, teamId);

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
          await deleteTeamWithId();
          toast.success("Team deleted");
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message);
          } else {
            toast.error("Couldn't delete team");
          }
        }

        setLoading(false);
      }}
    >
      <TrashIcon className="w-4" />
    </Button>
  );
};

export default DeleteTeamButton;
