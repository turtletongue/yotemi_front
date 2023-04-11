"use client";

import { formatTime } from "@utils";

interface InterviewMessageProps {
  content: string;
  createdAt: string;
  isOwn: boolean;
}

const InterviewMessage = ({
  content,
  createdAt,
  isOwn,
}: InterviewMessageProps) => {
  return (
    <div className={`mt-2 flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <article
        className={`rounded-lg break-all pl-3 pr-16 py-3 relative ${
          isOwn ? "bg-pale-lavender" : "bg-gray-100"
        }`}
      >
        {content}
        <span className="absolute bottom-1 right-2 text-[0.6rem] text-gray-500">
          {formatTime(createdAt)}
        </span>
      </article>
    </div>
  );
};

export default InterviewMessage;
