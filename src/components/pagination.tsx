"use client";

import usePagination, {
  BasePaginationProps,
  UsePagination,
} from "@/hooks/use-pagination";
import clsx from "clsx";
import {
  ButtonHTMLAttributes,
  Context,
  createContext,
  useContext,
} from "react";

export type PaginationProps = BasePaginationProps & {
  totalPages: number;
  edgePageCount: number;
  middlePagesSiblingCount: number;
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  as: (page: number) => React.ReactElement;
  children?: string | React.ReactNode;
};

type Pagination = UsePagination & {
  setCurrentPage?: (page: number) => void;
};

type PageButtonProps = ButtonProps & {
  /**
   * Provide a custom ReactElement (e.g. Next/Link)
   */
  as: (page: number) => React.ReactElement;
};

export const PrevButton = ({
  className,
  children,
  as: asFunc,
  ...buttonProps
}: ButtonProps) => {
  const pagination = useContext(PaginationContext);
  const as = asFunc?.(pagination.currentPage - 1);

  return (
    <as.type
      {...buttonProps}
      {...as.props}
      className={clsx(
        className,
        as.props.className,
        pagination.currentPage === 1 &&
          "pointer-events-none cursor-not-allowed",
      )}
    >
      {children}
    </as.type>
  );
};

export const NextButton = ({
  className,
  children,
  as: asFunc,
  ...buttonProps
}: ButtonProps) => {
  const pagination = useContext(PaginationContext);
  const as = asFunc?.(pagination.currentPage + 1);

  return (
    <as.type
      {...buttonProps}
      {...as.props}
      className={clsx(
        className,
        as.props.className,
        pagination.currentPage === pagination.pages.length &&
          "pointer-events-none cursor-not-allowed",
      )}
    >
      {children}
    </as.type>
  );
};

type ITruncableElementProps = {
  prev?: boolean;
};

const TruncableElement = ({ prev }: ITruncableElementProps) => {
  const pagination: Pagination = useContext(PaginationContext);

  const {
    isPreviousTruncable,
    isNextTruncable,
    truncableText,
    truncableClassName,
  } = pagination;

  return (isPreviousTruncable && prev === true) ||
    (isNextTruncable && !prev) ? (
    <li className={truncableClassName || undefined}>{truncableText}</li>
  ) : null;
};

export const PageButton = ({ as: asFunc }: PageButtonProps) => {
  const pagination: Pagination = useContext(PaginationContext);

  const renderPageButton = (page: number) => {
    const as = asFunc?.(page);

    return (
      <as.type key={page} tabIndex={0} {...as.props}>
        {page}
      </as.type>
    );
  };

  return (
    <>
      {pagination.previousPages.map(renderPageButton)}
      <TruncableElement prev />
      {pagination.middlePages.map(renderPageButton)}
      <TruncableElement />
      {pagination.nextPages.map(renderPageButton)}
    </>
  );
};

const defaultState: Pagination = {
  currentPage: 0,
  setCurrentPage: () => {},
  truncableText: "...",
  truncableClassName: "",
  pages: [],
  hasPreviousPage: false,
  hasNextPage: false,
  previousPages: [],
  isPreviousTruncable: false,
  middlePages: [],
  isNextTruncable: false,
  nextPages: [],
};

const PaginationContext: Context<Pagination> =
  createContext<Pagination>(defaultState);

export const Pagination = ({ ...paginationProps }: PaginationProps) => {
  const pagination = usePagination(paginationProps);

  return (
    <PaginationContext.Provider value={pagination}>
      <div className={paginationProps.className}>
        {paginationProps.children}
      </div>
    </PaginationContext.Provider>
  );
};

Pagination.PrevButton = PrevButton;
Pagination.NextButton = NextButton;
Pagination.PageButton = PageButton;
