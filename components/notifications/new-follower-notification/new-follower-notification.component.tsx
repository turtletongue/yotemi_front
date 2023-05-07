"use client";

import Link from "next/link";
import classnames from "classnames";

import { Avatar } from "@components";
import { useGetUserQuery } from "@redux/features/users";
import { Language, useTranslation } from "@app/i18n/client";
import { Id } from "@app/declarations";

interface NewFollowerNotificationProps {
  lang: Language;
  follower: {
    id: Id;
    fullName: string;
  };
  isSeen: boolean;
  reactOnHover?: boolean;
}

const NewFollowerNotification = ({
  lang,
  follower,
  isSeen,
  reactOnHover = false,
}: NewFollowerNotificationProps) => {
  const { translation } = useTranslation(lang, "new-follower-notification");

  const { data } = useGetUserQuery(follower.id);

  return (
    <Link
      href={data ? `/profile/${data.username}` : "#"}
      className={classnames(
        "flex w-full justify-center items-center py-5",
        isSeen
          ? "opacity-20"
          : classnames(
              "cursor-pointer",
              reactOnHover && "hover:bg-yankees-blue"
            )
      )}
    >
      <Avatar
        img={data?.avatarPath ?? null}
        size="md"
        rounded
        className="mx-3"
      />
      <p className="text-sm max-w-[19rem]">
        {follower.fullName} {translation("subscribed")}
      </p>
    </Link>
  );
};

export default NewFollowerNotification;
