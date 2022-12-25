"use client";

import { MouseEventHandler } from "react";
import Link from "next/link";

import { Avatar } from "@components";
import { Language, useTranslation } from "@app/i18n/client";

interface CurrentUserProps {
  lang: Language;
  id?: string;
  onClick?: MouseEventHandler;
}

const CurrentUser = ({ lang, id, onClick }: CurrentUserProps) => {
  const user = {
    name: "Alice",
    avatarUrl: "https://avatars.dicebear.com/api/croodles-neutral/alice.svg",
  };

  const { translation } = useTranslation(lang, "current-user");

  return (
    <Link
      href={`/${lang}/profile`}
      className="flex items-center cursor-pointer"
      onClick={onClick}
      id={id}
    >
      <span className="font-roboto text-white font-medium mr-2">
        {user.name}
      </span>
      <Avatar imageUrl={user.avatarUrl} alt={translation("avatar")} />
    </Link>
  );
};

export default CurrentUser;
