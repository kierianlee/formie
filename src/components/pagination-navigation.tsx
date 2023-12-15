"use client";

import { Pagination } from "@/components/pagination";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationNavigationProps {
  currentPage: number;
  totalPages: number;
}

const PaginationNavigation = ({
  currentPage,
  totalPages,
}: PaginationNavigationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Pagination
      currentPage={currentPage}
      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
      truncableText="..."
      truncableClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-zinc-700 border"
      totalPages={totalPages}
      edgePageCount={1}
      middlePagesSiblingCount={1}
    >
      <Pagination.PrevButton
        className="relative inline-flex items-center rounded-l-md border px-2 py-2 text-sm text-zinc-400 hover:bg-zinc-600 hover:text-white"
        as={page => {
          const clonedSearchParams = new URLSearchParams(searchParams);
          clonedSearchParams.set("page", `${page}`);

          return <Link href={`${pathname}?${clonedSearchParams.toString()}`} />;
        }}
      >
        Previous
      </Pagination.PrevButton>

      <Pagination.PageButton
        as={page => {
          const clonedSearchParams = new URLSearchParams(searchParams);
          clonedSearchParams.set("page", `${page}`);

          return (
            <Link
              href={`${pathname}?${clonedSearchParams.toString()}`}
              className={clsx(
                "relative inline-flex items-center border px-4 py-2 text-sm font-semibold hover:bg-zinc-600",
                !!(currentPage === page) && "bg-zinc-600 text-white",
              )}
            />
          );
        }}
      />

      <Pagination.NextButton
        className="relative inline-flex items-center rounded-r-md border px-2 py-2 text-sm text-gray-400 hover:bg-zinc-600 hover:text-white"
        as={page => {
          const clonedSearchParams = new URLSearchParams(searchParams);
          clonedSearchParams.set("page", `${page}`);

          return <Link href={`${pathname}?${clonedSearchParams.toString()}`} />;
        }}
      >
        Next
      </Pagination.NextButton>
    </Pagination>
  );
};

export default PaginationNavigation;
