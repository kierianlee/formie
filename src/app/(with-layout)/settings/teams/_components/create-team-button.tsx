"use client";

import { createTeam } from "@/actions/create-team";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

const CreateTeamButton = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateTeam = async (formData: FormData) => {
    setSubmitting(true);
    try {
      await createTeam(formData);
      toast.success("Team created");
      setModalOpen(false);
    } catch (err) {
      toast.error("Couldn't create team");
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-semibold">Teams</h1>
        <Dialog open={modalOpen} onOpenChange={open => setModalOpen(open)}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setModalOpen(true)}>
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create team</DialogTitle>
              <DialogDescription>
                Fill in a name for your team.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={e => {
                e.preventDefault();

                handleCreateTeam(new FormData(e.currentTarget));
              }}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    className="rounded-md border bg-zinc-800/40 p-2"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    disabled={submitting}
                    aria-disabled={submitting}
                    variant="default"
                    className="flex w-full items-center gap-4"
                    type="submit"
                  >
                    <span>Create</span>
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
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CreateTeamButton;
