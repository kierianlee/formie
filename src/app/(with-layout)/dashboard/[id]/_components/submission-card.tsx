"use client";

import { useCollapse } from "react-collapsed";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { submissions } from "@/db/schema";
import DeleteFormButton from "./delete-submission-button";
import { startCase } from "lodash";

interface SubmissionCardProps {
  submission: typeof submissions.$inferSelect;
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
        <div className="text-muted-foreground" suppressHydrationWarning>
          {dayjs(submission.date).format("DD/MM/YYYY HH:mm:ss")}
        </div>
        <DeleteFormButton submissionId={submission.id} />
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
        <div className="flex flex-1 flex-col">
          <div className="grid grid-cols-2 gap-4">
            {fields.slice(0, 2).map(([key, value]) => (
              <SubmissionCardField
                key={key}
                label={key}
                value={value}
                expanded={isExpanded}
              />
            ))}
          </div>
          <div {...getCollapseProps()}>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {fields.slice(2).map(([key, value]) => (
                <SubmissionCardField
                  key={key}
                  label={key}
                  value={value}
                  expanded={isExpanded}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubmissionCardField = ({
  label,
  value,
  expanded,
}: {
  label: string;
  value: any;
  expanded: boolean;
}) => {
  return (
    <div>
      <div className="mr-3 text-xs text-muted-foreground">
        {startCase(label)}:
      </div>
      <div
        className={cn(
          "text-xs",
          !expanded && "overflow-hidden text-ellipsis whitespace-nowrap",
        )}
      >
        {value}
      </div>
    </div>
  );
};

export default SubmissionCard;
