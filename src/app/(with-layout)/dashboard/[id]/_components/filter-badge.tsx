"use client";

import { FilterBadge } from "@/components/filter/filter-badge";
import { QueryType } from "@/components/filter/filter-consts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DashboardFilterBadgeProps {
  filterField: string;
  filterType: string;
  filterValue: string;
}

const DashboardFilterBadge = ({
  filterField,
  filterType,
  filterValue,
}: DashboardFilterBadgeProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const router = useRouter();

  return (
    <FilterBadge
      onRemove={() => {
        const clonedSearchParams = new URLSearchParams(searchParams);
        clonedSearchParams.delete("filterField");
        clonedSearchParams.delete("filterValue");
        clonedSearchParams.delete("filterType");

        router.push(`${pathname}?${clonedSearchParams.toString()}`);
      }}
      value={{
        accessor: filterField,
        label: filterField,
        query: filterType as QueryType,
        value: filterValue,
      }}
    />
  );
};

export default DashboardFilterBadge;
