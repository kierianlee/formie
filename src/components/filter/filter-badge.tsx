"use client";

import { XIcon } from "lucide-react";
import { type FilterValue } from "./filter-input";

export interface FilterBadgeProps {
  value: FilterValue;
  onRemove: (value: FilterValue) => void;
}

const FilterBadge = ({ value, onRemove }: FilterBadgeProps) => {
  return (
    <div className="inline-flex bg-background items-center gap-2 rounded-md py-2 px-4 text-xs">
      <div>
        {value.label} {value.query}{" "}
        {value.valueDisplay ?? typeof value.value === "string"
          ? value.value
          : value.value?.valueDisplay ??
            value.value?.label ??
            value.value?.value}
      </div>

      <button onClick={() => onRemove(value)}>
        <XIcon color="#fff" size="14px" />
      </button>
    </div>
  );
};

export { FilterBadge };
