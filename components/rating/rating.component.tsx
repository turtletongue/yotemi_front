import classnames from "classnames";

import FilledStar from "./filled-star.svg";
import NotFilledStar from "./not-filled-star.svg";

interface RatingProps {
  points: number;
  size?: number;
  onClick?: (points: number) => unknown;
}

const Rating = ({ points, size = 14, onClick }: RatingProps) => {
  const roundedPoints = Math.round(points);

  return (
    <span className="flex">
      {new Array(5).fill(null).map((_, index) => {
        const handleClick = () => onClick?.(index + 1);

        return (
          <span
            key={index}
            className={`${index === 0 ? "mr-0.5" : "mx-0.5"} flex items-center`}
          >
            {index + 1 <= roundedPoints ? (
              <FilledStar
                className={classnames(onClick && "cursor-pointer")}
                onClick={handleClick}
                width={size}
                height={size}
              />
            ) : (
              <NotFilledStar
                className={classnames(onClick && "cursor-pointer")}
                onClick={handleClick}
                width={size}
                height={size}
              />
            )}
          </span>
        );
      })}
    </span>
  );
};

export default Rating;
