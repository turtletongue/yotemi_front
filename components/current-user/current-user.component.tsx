"use client";

import { MouseEventHandler } from "react";
import Link from "next/link";
import { Avatar } from "flowbite-react";

import { Language } from "@app/i18n/client";

interface CurrentUserProps {
  lang: Language;
  firstName: string;
  avatarUrl?: string;
  id?: string;
  onClick?: MouseEventHandler;
}

const CurrentUser = ({
  lang,
  firstName,
  avatarUrl,
  id,
  onClick,
}: CurrentUserProps) => {
  return (
    <Link
      href={`/${lang}/profile`}
      className="flex items-center cursor-pointer"
      onClick={onClick}
      id={id}
    >
      <span className="text-white font-medium mr-2">{firstName}</span>
      <Avatar img={avatarUrl} size="sm" rounded />
    </Link>
  );
};

export default CurrentUser;
