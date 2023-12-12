"use client";

import { renameForm } from "@/actions/rename-form";
import { Input } from "@/components/ui/input";
import { forms } from "@/db/schema";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

interface SidebarItemProps {
  form: typeof forms.$inferSelect;
  activeId: string | null;
}

const SidebarItem = ({ form, activeId }: SidebarItemProps) => {
  const renameFormWithId = renameForm.bind(null, form.id);

  const [editable, setEditable] = useState(false);
  const [formState, renameAction] = useFormState(renameFormWithId, {
    success: false,
  });

  useEffect(() => {
    if (formState.success) {
    }
  }, [formState.success]);

  return !editable ? (
    <Link
      href={`/dashboard/${form.id}`}
      key={form.id}
      className={cn(
        "group rounded-md px-4 py-2 text-sm",
        activeId === form.id && "bg-zinc-700/60 duration-300",
      )}
    >
      <span className="flex items-center">
        <div
          className={cn(
            "mr-3 transition-all",
            activeId === form.id
              ? "text-foreground"
              : "text-muted-foreground/40 group-hover:text-foreground",
          )}
        >
          •
        </div>
        <div className="flex-1">{form.name}</div>
        <div
          className={
            "text-xs text-zinc-300 opacity-0 transition-all duration-300 group-hover:opacity-100"
          }
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            setEditable(true);
          }}
        >
          edit
        </div>
      </span>
    </Link>
  ) : (
    <form
      action={renameAction}
      onSubmit={() => {
        setEditable(false);
      }}
    >
      <RenameInput form={form} />
    </form>
  );
};

interface RenameInputProps {
  form: typeof forms.$inferSelect;
}

export function RenameInput({ form }: RenameInputProps) {
  const [inputValue, setInputValue] = useState(form.name);

  return (
    <Input
      name="name"
      value={inputValue}
      onChange={(e) => setInputValue(e.currentTarget.value)}
    />
  );
}

export default SidebarItem;
