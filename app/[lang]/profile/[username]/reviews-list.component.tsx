"use client";

import { useEffect, useState } from "react";

import { Pagination, ReviewCard, ReviewCardSkeleton } from "@components";
import { Review, useListReviewsQuery } from "@store/features/reviews";
import { Language, useTranslation } from "@app/i18n/client";
import { Id } from "@app/declarations";

interface ReviewsListProps {
  lang: Language;
  initialReviews: Review[];
  userId: Id;
}

const ReviewsList = ({ lang, initialReviews, userId }: ReviewsListProps) => {
  const { translation } = useTranslation(lang, "profile");

  const [page, setPage] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const {
    data: { items = [], totalPages = 0 } = {},
    isLoading,
    isSuccess,
  } = useListReviewsQuery({ page, pageSize: 4, userId });

  useEffect(() => {
    if (isSuccess && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isSuccess, isInitialLoading]);

  const reviews = isLoading && isInitialLoading ? initialReviews : items;

  return (
    <>
      {isLoading &&
        !isInitialLoading &&
        new Array(4)
          .fill(null)
          .map((_, index) => <ReviewCardSkeleton key={index} />)}
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
      {!isLoading && reviews.length === 0 && (
        <span className="text-gray-500 text-center text-sm my-6">
          {translation("noReviews")}
        </span>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          onPageChange={(page) => setPage(page)}
          showIcons={true}
          totalPages={totalPages ?? 1}
          previousLabel=""
          nextLabel=""
          className="mt-4 mx-auto"
        />
      )}
    </>
  );
};

export default ReviewsList;
