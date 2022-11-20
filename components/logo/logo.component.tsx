import { MouseEventHandler } from "react";
import Link from "next/link";

import { LanguageParams } from "@app/i18n.params";

interface LogoProps extends LanguageParams {
  onClick?: MouseEventHandler;
}

const Logo = ({ lang, onClick }: LogoProps) => {
  return (
    <span className="font-mitr text-white text-xl" onClick={onClick}>
      <Link href={`/${lang}`}>MeetLane</Link>
    </span>
  );
};

export default Logo;
