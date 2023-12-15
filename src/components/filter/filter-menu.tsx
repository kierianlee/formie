"use client";

import type { ReactNode } from "react";
import { FilterIcon } from "lucide-react";
import {
  FilterInput,
  type FilterInputOption,
  type FilterValue,
} from "./filter-input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";

export interface FilterMenuProps {
  onOpen: () => void;
  onClose: () => void;
  onSubmit: (value: FilterValue) => void;
  opened: boolean;
  options: FilterInputOption[];
  trigger?: (onOpen: () => void) => ReactNode;
}

const FilterMenu = ({
  onClose,
  onOpen,
  onSubmit,
  opened,
  options,
  trigger,
}: FilterMenuProps) => {
  return (
    <DropdownMenu
      open={opened}
      onOpenChange={open => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        {trigger ? (
          trigger(onOpen)
        ) : (
          <Button
            size="sm"
            onClick={onOpen}
            variant="outline"
            className="flex items-center gap-2 px-4 py-1 text-xs"
          >
            <FilterIcon size="16px" />
            <span>Filter</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="overflow-visible">
        <FilterInput
          onSubmit={value => {
            onSubmit(value);
            onClose();
          }}
          options={options}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { FilterMenu };
