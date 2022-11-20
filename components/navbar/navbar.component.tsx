"use client";

import { Fragment, MouseEventHandler, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import Logo from "../logo";
import NavbarLink from "./navbar-link";
import GradientLine from "./gradient-line";
import MobileNavbarControll from "./mobile-navbar-controll";
import getNavbarItems, {
  INavbarComponent,
  INavbarLink,
  isNavbarComponent,
} from "./navbar-items.constant";

import type { LanguageParams } from "@app/i18n.params";

interface NavbarProps extends LanguageParams {}

const Navbar = ({ lang }: NavbarProps) => {
  const authenticationState = "authenticated";

  const [isMobileNavbarOpened, setIsMobileNavbarOpened] = useState(false);
  const closeMobileNavbar = () => setIsMobileNavbarOpened(false);

  const displayedItems = getNavbarItems(lang, closeMobileNavbar).filter(
    byDisplayCase(authenticationState)
  );
  const displayedComponents = displayedItems.map(
    toComponent(closeMobileNavbar)
  );

  const leftComponents = displayedComponents.slice(0, -1);
  const rightComponents = displayedComponents.slice(-1);

  return (
    <>
      <nav className="bg-yankees-blue w-full h-14 flex items-center px-5 relative z-30">
        <Logo lang={lang} onClick={closeMobileNavbar} />
        <div className="hidden sm:flex items-center w-full justify-between ml-10">
          <ul className="flex items-center">{leftComponents}</ul>
          <ul className="flex items-center">{rightComponents}</ul>
        </div>
        <div className="sm:hidden flex w-full justify-end">
          <MobileNavbarControll
            isNavbarOpened={isMobileNavbarOpened}
            toggleNavbar={() =>
              setIsMobileNavbarOpened((isOpened) => !isOpened)
            }
          />
        </div>
      </nav>
      <GradientLine />
      <Transition show={isMobileNavbarOpened} appear as={Fragment}>
        <Dialog
          open={isMobileNavbarOpened}
          onClose={closeMobileNavbar}
          className="relative z-10"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full p-4 pt-20 justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
                  <ul className="w-full h-full flex flex-col">
                    {displayedComponents}
                  </ul>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const byDisplayCase = (
  authenticationState: "authenticated" | "not-authenticated"
) => {
  return (navbarItem: INavbarLink | INavbarComponent) => {
    return (
      navbarItem.displayCase === "always" ||
      navbarItem.displayCase === authenticationState
    );
  };
};

const toComponent = (clickHandler: MouseEventHandler) => {
  return function MappedComponent(navbarItem: INavbarLink | INavbarComponent) {
    const component = isNavbarComponent(navbarItem) ? (
      navbarItem.component
    ) : (
      <NavbarLink link={navbarItem.link} onClick={clickHandler}>
        {navbarItem.label}
      </NavbarLink>
    );

    return <Fragment key={navbarItem.id}>{component}</Fragment>;
  };
};

export default Navbar;
