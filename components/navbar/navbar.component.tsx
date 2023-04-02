"use client";

import { useEffect, useState } from "react";
import { useTonWallet } from "@tonconnect/ui-react";

import NavbarItems from "./navbar-items.component";
import MobileMenuControl from "../mobile-menu-control";
import MobileNavbar from "../mobile-navbar";
import GradientLine from "../gradient-line";
import Logo from "../logo";

import baseApi from "@redux/features/base.api";
import { loggedOut } from "@redux/features/auth";
import { useAppDispatch } from "@redux/store-config/hooks";
import { Language } from "@app/i18n";

interface NavbarProps {
  lang: Language;
}

const Navbar = ({ lang }: NavbarProps) => {
  const [isMobileNavbarOpened, setIsMobileNavbarOpened] = useState(false);
  const closeMobileNavbar = () => setIsMobileNavbarOpened(false);

  const dispatch = useAppDispatch();
  const wallet = useTonWallet();

  useEffect(() => {
    if (!wallet) {
      dispatch(baseApi.util.resetApiState());
      dispatch(loggedOut());
    }
  }, [wallet]);

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
