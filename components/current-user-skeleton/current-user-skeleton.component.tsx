import classnames from "classnames";

interface CurrentUserSkeletonProps {
  className?: string;
  id?: string;
}

const CurrentUserSkeleton = ({ className, id }: CurrentUserSkeletonProps) => {
  return (
    <div
      className={classnames("flex items-center animate-pulse", className)}
      id={id}
    >
      <div className="h-2.5 w-24 mr-2" />
      <div className="h-10 w-10 bg-gray-400 rounded-full" />
    </div>
  );
};

export default CurrentUserSkeleton;
