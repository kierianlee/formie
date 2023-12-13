import { PaginationProps } from "@/components/pagination";
import { useMemo } from "react";

export type BasePaginationProps = {
  currentPage: number;
  setCurrentPage?: (page: number) => void;
  truncableText?: string;
  truncableClassName?: string;
};

export type UsePagination = BasePaginationProps & {
  pages: number[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  previousPages: number[];
  isPreviousTruncable: boolean;
  middlePages: number[];
  isNextTruncable: boolean;
  nextPages: number[];
};

const usePagination = ({
  currentPage,
  setCurrentPage,
  truncableText = "...",
  truncableClassName = "",
  totalPages,
  edgePageCount,
  middlePagesSiblingCount,
}: PaginationProps): UsePagination => {
  const pages = Array(totalPages)
    .fill(0)
    .map((_, i) => i + 1);

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const isReachedToFirst = currentPage <= middlePagesSiblingCount;
  const isReachedToLast = currentPage + middlePagesSiblingCount >= totalPages;

  const middlePages = useMemo(() => {
    const middlePageCount = middlePagesSiblingCount * 2 + 1;
    if (isReachedToFirst) {
      return pages.slice(0, middlePageCount);
    }
    if (isReachedToLast) {
      return pages.slice(-middlePageCount);
    }
    return pages.slice(
      currentPage - middlePagesSiblingCount,
      currentPage + middlePagesSiblingCount + 1,
    );
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pages]);

  const getAllPreviousPages = () => {
    return pages.slice(0, middlePages[0] - 1);
  };

  const previousPages = useMemo(() => {
    if (isReachedToFirst || getAllPreviousPages().length < 1) {
      return [];
    }
    return pages
      .slice(0, edgePageCount)
      .filter((p) => !middlePages.includes(p));

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pages]);

  const getAllNextPages = useMemo(() => {
    return pages.slice(
      middlePages[middlePages.length - 1],
      pages[pages.length],
    );
  }, [pages, middlePages]);

  const nextPages = useMemo(() => {
    if (isReachedToLast) {
      return [];
    }
    if (getAllNextPages.length < 1) {
      return [];
    }
    return pages
      .slice(pages.length - edgePageCount, pages.length)
      .filter((p) => !middlePages.includes(p));

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [middlePages, pages]);

  const isPreviousTruncable = useMemo(() => {
    // Is truncable if first value of middlePage is larger than last value of previousPages
    return middlePages[0] > previousPages[previousPages.length - 1] + 1;
  }, [previousPages, middlePages]);

  const isNextTruncable = useMemo(() => {
    // Is truncable if last value of middlePage is larger than first value of previousPages
    return middlePages[middlePages.length - 1] + 1 < nextPages[0];
  }, [nextPages, middlePages]);

  return {
    currentPage,
    setCurrentPage,
    truncableText,
    truncableClassName,
    pages,
    hasPreviousPage,
    hasNextPage,
    previousPages,
    isPreviousTruncable,
    middlePages,
    isNextTruncable,
    nextPages,
  };
};

export default usePagination;
