"use client";

import { useState } from "react";

import { emptyOr } from "@utils";
import { Language, useTranslation } from "@app/i18n/client";

interface MobileMenuControlProps {
  lang: Language;
  isNavbarOpened: boolean;
  toggleNavbar: () => unknown;
}

const MobileMenuControl = ({
  lang,
  isNavbarOpened,
  toggleNavbar,
}: MobileMenuControlProps) => {
  const [isUsed, setIsUsed] = useState(false);

  const onClick = () => {
    toggleNavbar();

    if (!isUsed) {
      setIsUsed(true);
    }
  };

  const { translation } = useTranslation(lang, "navbar");

  return (
    <button
      className="cursor-pointer w-8 h-5 flex flex-col justify-between sm:hidden ml-auto"
      aria-label={translation("mobile-menu-control")!}
      onClick={onClick}
    >
      <div
        className={`${baseBarClasses} ${
          emptyOr(isNavbarOpened && "animate-top-bar-to-cross") ||
          emptyOr(isUsed && "animate-top-bar-from-cross")
        }`}
      />
      <div
        className={`${baseBarClasses} ${
          emptyOr(isNavbarOpened && "animate-middle-bar-to-cross") ||
          emptyOr(isUsed && "animate-middle-bar-from-cross")
        }`}
      />
      <div
        className={`${baseBarClasses} ${
          emptyOr(isNavbarOpened && "animate-bottom-bar-to-cross") ||
          emptyOr(isUsed && "animate-bottom-bar-from-cross")
        }`}
      />
    </button>
  );
};

const baseBarClasses = "bg-white h-0.5 w-full relative";

export default MobileMenuControl;
