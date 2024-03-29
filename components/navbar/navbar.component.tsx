"use client";

import { useState } from "react";

import { Language } from "@app/i18n/client";
import NavbarItems from "./navbar-items.component";
import MobileMenuControl from "../mobile-menu-control";
import MobileNavbar from "../mobile-navbar";
import GradientLine from "../gradient-line";
import Logo from "../logo";

interface NavbarProps {
  lang: Language;
}

const Navbar = ({ lang }: NavbarProps) => {
  const [isMobileNavbarOpened, setIsMobileNavbarOpened] = useState(false);
  const closeMobileNavbar = () => setIsMobileNavbarOpened(false);

  return (
    <header>
      <nav className="bg-yankees-blue w-full h-14 flex items-center px-5 relative z-30">
        <Logo lang={lang} onClick={closeMobileNavbar} />
        <ul className="navbar-items hidden sm:grid content-center w-full ml-10">
          <NavbarItems lang={lang} />
        </ul>
        <MobileMenuControl
          lang={lang}
          isNavbarOpened={isMobileNavbarOpened}
          toggleNavbar={() => setIsMobileNavbarOpened((isOpened) => !isOpened)}
        />
      </nav>
      <GradientLine />
      <MobileNavbar isOpened={isMobileNavbarOpened}>
        <NavbarItems lang={lang} onClick={closeMobileNavbar} />
      </MobileNavbar>
    </header>
  );
};

export default Navbar;
