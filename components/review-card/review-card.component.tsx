"use client";

import { useRouter } from "next/navigation";

import { Avatar, Rating } from "@components";
import { Review } from "@redux/features/reviews";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/profile/${review.reviewer.username}`);
  };

  return (
    <article className="bg-card rounded-3xl flex w-full md:w-auto md:min-w-[33rem] p-5 mt-5">
      <Avatar
        img={review.reviewer.avatarPath}
        className="h-min mt-1 mr-4 cursor-pointer"
        rounded
        onClick={onClick}
      />
      <div className="grow">
        <div className="flex w-full justify-between">
          <span>{review.reviewer.fullName}</span>
          <Rating points={review.points} />
        </div>
        <span className="mt-2 text-gray-500 text-sm">
          @{review.reviewer.username}
        </span>
        <div className="mt-4 text-sm">
          {review.comment.split("\n").map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ReviewCard;
