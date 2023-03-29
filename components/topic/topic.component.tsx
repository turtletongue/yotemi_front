import { ReactNode } from "react";

interface TopicProps {
  colorHex: string;
  children: ReactNode;
}

const Topic = ({ colorHex, children }: TopicProps) => {
  return (
    <span
      className="rounded-full px-4 py-1 text-sm"
      style={{ backgroundColor: `#${colorHex}` }}
    >
      {children}
    </span>
  );
};

export default Topic;
