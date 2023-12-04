"use client";

import CirclePulse from "@/components/pulse/pulse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface FormValues {
  email: string;
  message: string;
}

const MockForm = () => {
  const [submissions, setSubmissions] = useState<
    { date: Date; fields: Record<string, any> }[]
  >([]);
  const [submissionAutoAnimateParentRef] = useAutoAnimate();

  const form = useForm({
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const handleSubmission = (values: FormValues) => {
    setSubmissions((prev) => [...prev, { date: new Date(), fields: values }]);
    form.reset();
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <div className="rounded-md border bg-zinc-800/40 p-6">
          <form
            className="flex flex-col space-y-4"
            onSubmit={form.handleSubmit(handleSubmission)}
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                required
                {...form.register("email", { required: true })}
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                id="message"
                placeholder="Message"
                required
                {...form.register("message", { required: true })}
              />
            </div>

            <Button className="w-full">Submit</Button>
          </form>
        </div>
      </div>

      <div
        className="rounded-md border bg-zinc-800/40 p-6"
        ref={submissionAutoAnimateParentRef}
      >
        {submissions.length ? (
          submissions.map((s, i) => (
            <MockFormSubmission key={i} date={s.date} fields={s.fields} />
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <CirclePulse className="mb-4 bg-primary/50" />
            <div>
              <div className="mb-2">No submissions yet.</div>
              <div className="text-sm text-muted-foreground">
                Submit the form to see how submissions look like.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MockFormSubmissionProps {
  date: Date;
  fields: Record<string, any>;
}

const MockFormSubmission = ({ date, fields }: MockFormSubmissionProps) => {
  return (
    <div className="mb-4">
      <div className="mb-2 text-sm text-muted-foreground">
        {date.toLocaleString()}
      </div>
      <div className="grid w-full grid-cols-2 overflow-hidden rounded-md border bg-zinc-800 p-4">
        {Object.entries(fields).map(([key, value]) => (
          <div key={key}>
            <div className="text-muted-foreground">{key}</div>
            <div className="break-words text-sm">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockForm;
