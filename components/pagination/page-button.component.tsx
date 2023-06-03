"use client";

import { ReactNode } from "react";

interface PageButtonProps {
  pageNumber: number;
  setPage: (page: number) => unknown;
  isActive?: boolean;
  label?: string;
  children?: ReactNode;
}

const PageButton = ({
  pageNumber,
  setPage,
  isActive = true,
  label,
  children,
}: PageButtonProps) => {
  return (
    <button
      disabled={!isActive}
      onClick={() => setPage(pageNumber)}
      aria-label={label}
      className="flex justify-center items-center relative group"
    >
      <div className="transition ease-in-out delay-50 bg-purple-600 group-hover:bg-purple-800 group-hover:scale-110 duration-300 rounded-full w-10 h-10" />
      <span className="absolute">{children}</span>
    </button>
  );
};

export default PageButton;
