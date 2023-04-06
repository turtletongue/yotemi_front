import { ReactNode } from "react";
import { X } from "react-feather";
import classnames from "classnames";

interface TopicProps {
  colorHex: string;
  deletable?: boolean;
  onDelete?: () => unknown;
  children: ReactNode;
}

const Topic = ({
  colorHex,
  deletable = false,
  onDelete,
  children,
}: TopicProps) => {
  return (
    <div
      className={`rounded-full pl-4 pr-4 py-1 text-sm text-center w-fit ${classnames(
        deletable &&
          "group flex items-center cursor-pointer transition-all duration-300 ease-in-out hover:pr-2 hover:opacity-90"
      )}`}
      style={{ backgroundColor: `#${colorHex}` }}
      onClick={onDelete}
    >
      <span>{children}</span>
      <X size={17} className="ml-2 hidden group-hover:block" />
    </div>
  );
};

export default Topic;
