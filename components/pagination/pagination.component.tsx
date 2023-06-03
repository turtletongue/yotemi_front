"use client";

import classnames from "classnames";
import { ChevronLeft, ChevronRight } from "react-feather";

import PageButton from "./page-button.component";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => unknown;
  showIcons?: boolean;
  totalPages: number;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
  maxPagesCount?: number;
}

const Pagination = ({
  showIcons,
  className,
  onPageChange,
  currentPage,
  totalPages,
  previousLabel,
  nextLabel,
  maxPagesCount = 5,
}: PaginationProps) => {
  if (totalPages <= 1) {
    return <></>;
  }

  const currentBlockIndex = Math.floor((currentPage - 1) / maxPagesCount);
  const sizeRemainder = totalPages - currentBlockIndex * maxPagesCount;
  const blockSize = Math.min(maxPagesCount, sizeRemainder);

  return (
    <div className={classnames(className, "flex gap-2")}>
      {showIcons && currentPage > 1 && (
        <PageButton
          pageNumber={currentPage - 1}
          setPage={onPageChange}
          label={previousLabel}
        >
          <ChevronLeft size={17} />
        </PageButton>
      )}
      {new Array(blockSize).fill(null).map((_, index) => {
        const buttonNumber = index + 1;
        const pageNumber = currentBlockIndex * maxPagesCount + buttonNumber;

        return (
          <PageButton
            key={index}
            pageNumber={pageNumber}
            setPage={onPageChange}
          >
            {pageNumber}
          </PageButton>
        );
      })}
      {showIcons && currentPage < totalPages && (
        <PageButton
          pageNumber={currentPage + 1}
          setPage={onPageChange}
          label={nextLabel}
        >
          <ChevronRight size={17} />
        </PageButton>
      )}
    </div>
  );
};

export default Pagination;
