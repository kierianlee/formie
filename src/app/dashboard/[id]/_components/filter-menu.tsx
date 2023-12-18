"use client";

import Filter, { FilterInputOption } from "@/components/filter";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

interface FilterMenuProps {
  options: FilterInputOption[];
}

const FilterMenu = ({ options }: FilterMenuProps) => {
  const [filterMenuOpened, setFilterMenuOpened] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Filter.Menu
      onSubmit={val => {
        const clonedSearchParams = new URLSearchParams(searchParams);
        clonedSearchParams.set("filterField", val.accessor);
        clonedSearchParams.set(
          "filterValue",
          typeof val.value === "string" ? val.value : val.value?.value,
        );
        clonedSearchParams.set("filterType", val.query);

        router.push(`${pathname}?${clonedSearchParams.toString()}`);
      }}
      opened={filterMenuOpened}
      onClose={() => setFilterMenuOpened(false)}
      onOpen={() => setFilterMenuOpened(true)}
      options={options}
    />
  );
};

export { FilterMenu };
