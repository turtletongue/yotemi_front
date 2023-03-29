"use client";

import { Language } from "@app/i18n";
import { useTranslation } from "@app/i18n/client";

interface InterviewStatusProps {
  lang: Language;
  status: "created" | "paid" | "finished" | "canceled" | "missing";
}

const statusToColor = {
  created: "bg-yellow-400",
  paid: "bg-green-400",
  started: "bg-blue-400",
  canceled: "bg-red-500",
  missing: "bg-red-500",
  finished: "bg-purple-400",
} as const;

const InterviewStatus = ({ lang, status }: InterviewStatusProps) => {
  const { translation } = useTranslation(lang, "interview-status");

  return (
    <span
      className={`rounded-full px-4 py-1 text-sm lowercase ${statusToColor[status]}`}
    >
      {translation(status)}
    </span>
  );
};

export default InterviewStatus;
