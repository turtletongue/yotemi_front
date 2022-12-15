import { MouseEventHandler } from "react";
import Link from "next/link";

import { LanguageParams } from "@app/i18n.params";
import LogoIcon from "../../public/logo.svg";

interface LogoProps extends LanguageParams {
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
