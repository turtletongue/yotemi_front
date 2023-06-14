"use client";

import Link from "next/link";
import classnames from "classnames";

import { Avatar } from "@components";
import { useGetUserQuery } from "@store/features/users";
import { Language, useTranslation } from "@app/i18n/client";
import { Id } from "@app/declarations";
import { formatDateTime } from "@utils";

interface InterviewScheduledNotificationProps {
  lang: Language;
  interview: {
    startAt: string;
  };
  creator: {
    id: Id;
    fullName: string;
  };
  isSeen: boolean;
  reactOnHover?: boolean;
}

const InterviewScheduledNotification = ({
  lang,
  interview,
  creator,
  isSeen,
  reactOnHover = false,
}: InterviewScheduledNotificationProps) => {
  const { translation } = useTranslation(
    lang,
    "interview-scheduled-notification"
  );

  const { data } = useGetUserQuery(creator.id);

  return (
    <Link
      href={data ? `/profile/${data.username}` : "#"}
      className={`flex w-full items-center px-2 py-5 ${
        isSeen
          ? "opacity-20"
          : classnames(
              "cursor-pointer",
              reactOnHover && "hover:bg-yankees-blue"
            )
      }`}
    >
      <Avatar
        img={data?.avatarPath ?? null}
        size="md"
        rounded
        className="mx-3"
      />
      <p className="text-sm max-w-[19rem]">
        {creator.fullName} {translation("plannedInterview")}{" "}
        {formatDateTime(interview.startAt)}
      </p>
    </Link>
  );
};

export default InterviewScheduledNotification;
