"use client";

import { MouseEventHandler } from "react";
import Link from "next/link";

import LogoIcon from "../../public/logo.svg";

import { Language } from "@app/i18n";

interface LogoProps {
  lang: Language;
  onClick?: MouseEventHandler;
}

const Logo = ({ lang, onClick }: LogoProps) => {
  return (
    <Link className="pb-1" href={`/${lang}`} onClick={onClick}>
      <LogoIcon />
    </Link>
  );
};

export default Logo;
