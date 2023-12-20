"use client";

import { renameForm } from "@/actions/rename-form";
import { Input } from "@/components/ui/input";
import { forms } from "@/db/schema";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

interface SidebarItemProps {
  form: typeof forms.$inferSelect;
}

const SidebarItem = ({ form }: SidebarItemProps) => {
  const pathname = usePathname();
  const renameFormWithId = renameForm.bind(null, form.id);

  const [editable, setEditable] = useState(false);
  const [inputValue, setInputValue] = useState(form.name);
  const [submitting, setSubmitting] = useState(false);

  const activeId = useMemo(() => {
    const split = pathname.split("/");

    return split[split.length - 1];
  }, [pathname]);

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
        {activeId === form.id && (
          <>
            {!submitting ? (
              <button
                className={cn(
                  "text-xs text-zinc-300 transition-all duration-300 group-hover:opacity-100",
                  activeId === form.id ? "opacity-70" : "opacity-0",
                )}
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();

                  setEditable(true);
                }}
              >
                edit
              </button>
            ) : (
              <TailSpin
                height="20"
                width="20"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
              />
            )}
          </>
        )}
      </span>
    </Link>
  ) : (
    <form
      onSubmit={async e => {
        e.preventDefault();

        setEditable(false);
        setSubmitting(true);
        try {
          await renameFormWithId(new FormData(e.currentTarget));
          toast.success("Form renamed");
        } catch (err) {
          toast.error("Couldn't rename form");
        }
        setSubmitting(false);
      }}
    >
      <Input
        name="name"
        value={inputValue}
        onChange={e => setInputValue(e.currentTarget.value)}
      />
    </form>
  );
};

export default SidebarItem;
