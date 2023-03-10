"use client";

import { useState } from "react";

import NavbarItems from "./navbar-items.component";
import MobileMenuControl from "../mobile-menu-control";
import MobileNavbar from "../mobile-navbar";
import GradientLine from "../gradient-line";
import Logo from "../logo";

import { Language } from "@app/i18n";

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
          <NavbarItems lang={lang} isAuthenticated={false} />
        </ul>
        <MobileMenuControl
          lang={lang}
          isNavbarOpened={isMobileNavbarOpened}
          toggleNavbar={() => setIsMobileNavbarOpened((isOpened) => !isOpened)}
        />
      </nav>
      <GradientLine />
      <MobileNavbar isOpened={isMobileNavbarOpened}>
        <NavbarItems lang={lang} isAuthenticated={false} />
      </MobileNavbar>
    </header>
  );
};

export default Navbar;
