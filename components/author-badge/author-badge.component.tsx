"use client";

import { Avatar } from "@components";
import { Language, useTranslation } from "@app/i18n/client";

interface AuthorBadgeProps {
  lang: Language;
  firstName: string;
  avatarPath: string | null;
  isOwn: boolean;
}

const AuthorBadge = ({
  lang,
  firstName,
  avatarPath,
  isOwn,
}: AuthorBadgeProps) => {
  const { translation } = useTranslation(lang, "author-badge");

  return (
    <div
      className={`w-full flex my-2 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <div className="flex gap-2 items-center">
        <Avatar img={avatarPath} size="xs" rounded />
        <span className="relative top-0.5">
          {isOwn ? translation("you") : firstName}
        </span>
      </div>
    </div>
  );
};

export default AuthorBadge;
