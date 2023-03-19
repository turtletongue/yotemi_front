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
    <article
      className="bg-card rounded-3xl flex w-96 p-5 mt-5"
      onClick={onClick}
    >
      <Avatar
        img={review.reviewer.avatarPath ?? undefined}
        className="h-min mt-1 mr-4"
        rounded
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
