"use client";

import { useCollapse } from "react-collapsed";
import { mockForms } from "./page";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmissionCardProps {
  submission: (typeof mockForms)[0]["submissions"][0];
}

const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  const fields = useMemo(
    () => Object.entries(submission.fields).filter(([_, v]) => v),
    [submission.fields],
  );

  return (
    <div>
      <div className="mb-2 flex justify-between text-xs">
        <div className="text-muted-foreground">
          {dayjs(submission.date).format("DD/MM/YYYY HH:mm:ss")}
        </div>
        <div className="text-red-400">Delete</div>
      </div>
      <div
        className="flex space-x-4 rounded-md bg-zinc-700/50 p-4"
        {...getToggleProps()}
      >
        <div>
          <ChevronDown
            className={cn(
              "transition duration-200",
              isExpanded ? "-rotate-180" : "",
            )}
          />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {fields.slice(0, 2).map(([key, value]) => (
              <SubmissionCardField key={key} label={key} value={value} />
            ))}
          </div>
          {fields.length > 2 && (
            <div className="grid grid-cols-2 gap-4" {...getCollapseProps()}>
              {fields.slice(2).map(([key, value]) => (
                <SubmissionCardField key={key} label={key} value={value} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SubmissionCardField = ({
  label,
  value,
}: {
  label: string;
  value: any;
}) => {
  return (
    <div>
      <div className="mr-3 text-xs text-muted-foreground">{label}:</div>
      <div className="text-xs">{value}</div>
    </div>
  );
};

export default SubmissionCard;
