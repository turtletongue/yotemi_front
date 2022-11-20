import { MouseEventHandler } from "react";
import Link from "next/link";

import { Avatar } from "@components";
import { avatarAltText } from "./text.i18n";

import type { LanguageParams } from "@app/i18n.params";

interface CurrentUserProps extends LanguageParams {
  onClick?: MouseEventHandler;
}

const CurrentUser = ({ lang, onClick }: CurrentUserProps) => {
  const user = {
    name: "Alice",
    avatarUrl: "https://avatars.dicebear.com/api/croodles-neutral/alice.svg",
  };

  return (
    <Link
      href={`/${lang}/profile`}
      className="flex items-center cursor-pointer"
      onClick={onClick}
    >
      <span className="font-roboto-mono sm:text-white mr-2">{user.name}</span>
      <Avatar imageUrl={user.avatarUrl} alt={avatarAltText[lang]} />
    </Link>
  );
};

export default CurrentUser;
