import { MouseEventHandler, ReactNode } from "react";

interface SessionControlProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler;
}

const SessionControl = ({
  children,
  onClick,
  className,
}: SessionControlProps) => {
  return (
    <button
      className={`rounded-full p-3 bg-cetacean-blue hover:bg-yankees-blue border-2 border-vivid-medium ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SessionControl;
