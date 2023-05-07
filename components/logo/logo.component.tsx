"use client";

import { MouseEventHandler } from "react";
import Link from "next/link";

import { Language, useTranslation } from "@app/i18n/client";

import LogoIcon from "@app/public/logo.svg";

interface LogoProps {
  lang: Language;
  onClick?: MouseEventHandler;
}

const Logo = ({ lang, onClick }: LogoProps) => {
  const { translation } = useTranslation(lang, "logo");

  return (
    <Link
      className="pb-1"
      href={`/${lang}`}
      onClick={onClick}
      aria-label={translation("toHomepage")!}
    >
      <LogoIcon />
    </Link>
  );
};

export default Logo;
