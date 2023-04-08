import FilledStar from "./filled-star.svg";
import NotFilledStar from "./not-filled-star.svg";

interface RatingProps {
  points: number;
}

const Rating = ({ points }: RatingProps) => {
  const roundedPoints = Math.round(points);

  return (
    <span className="flex">
      {new Array(5).fill(null).map((_, index) => {
        return (
          <span
            key={index}
            className={`${index === 0 ? "mr-0.5" : "mx-0.5"} flex items-center`}
          >
            {index + 1 <= roundedPoints ? <FilledStar /> : <NotFilledStar />}
          </span>
        );
      })}
    </span>
  );
};

export default Rating;
