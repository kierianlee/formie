"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortAsc, SortDesc } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface SortButtonProps {
  sort: {
    field: string;
    direction: "asc" | "desc";
  };
  href: string;
  options: string[];
}

const SortButton = ({ sort, options }: SortButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2 px-4 py-1 text-xs"
        >
          {sort.direction === "asc" ? (
            <SortAsc className="w-4" />
          ) : (
            <SortDesc className="w-4" />
          )}
          <span>{sort.field}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <CustomDropdownMenuItem
          option="Date"
          direction={sort.field === "Date" ? sort.direction : null}
        />
        {options.map(option => (
          <CustomDropdownMenuItem
            key={option}
            option={option}
            direction={sort.field === option ? sort.direction : null}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface CustomDropdownMenuProps {
  option: string;
  direction: "asc" | "desc" | null;
}

const CustomDropdownMenuItem = ({
  option,
  direction,
}: CustomDropdownMenuProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <DropdownMenuItem
      key={option}
      className="flex min-h-[36px] items-center gap-2 text-xs"
      asChild
    >
      <Link
        href={(() => {
          const clonedSearchParams = new URLSearchParams(searchParams);
          clonedSearchParams.set("sortField", option);
          clonedSearchParams.set(
            "sortDir",
            direction === "asc"
              ? "desc"
              : direction === "desc"
                ? "asc"
                : "desc",
          );

          return `${pathname}?${clonedSearchParams}`;
        })()}
      >
        {direction === "asc" ? (
          <SortAsc className="w-3" />
        ) : direction === "desc" ? (
          <SortDesc className="w-3" />
        ) : (
          <></>
        )}{" "}
        <span>{option}</span>
      </Link>
    </DropdownMenuItem>
  );
};

export default SortButton;
