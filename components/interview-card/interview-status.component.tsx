"use client";

import { Language } from "@app/i18n";
import { useTranslation } from "@app/i18n/client";

interface InterviewStatusProps {
  lang: Language;
  status?: "created" | "paid" | "finished" | "canceled" | "notConnected";
}

const statusToColor = {
  created: "bg-yellow-400",
  paid: "bg-green-400",
  started: "bg-blue-400",
  canceled: "bg-red-500",
  finished: "bg-purple-400",
  notConnected: "bg-gray-400",
} as const;

const InterviewStatus = ({
  lang,
  status = "notConnected",
}: InterviewStatusProps) => {
  const { translation } = useTranslation(lang, "interview-status");

  return (
    <span
      className={`rounded-full px-4 py-1 text-sm text-center ${statusToColor[status]} min-w-[5rem] min-h-[1.8rem]`}
    >
      {translation(status)}
    </span>
  );
};

export default InterviewStatus;
