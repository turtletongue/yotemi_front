"use client";

import { MouseEventHandler } from "react";

import { Language, useTranslation } from "@app/i18n/client";
import { useAppSelector } from "@redux/store-config/hooks";
import { selectIsAuthenticated, selectUser } from "@redux/features/auth";
import NavbarLink from "../navbar-link";
import Notifications from "../notifications";
import CurrentUser from "../current-user";

interface NavbarItemsProps {
  lang: Language;
  onClick?: MouseEventHandler;
}

const NavbarItems = ({ lang, onClick }: NavbarItemsProps) => {
  const { translation } = useTranslation(lang, "navbar");

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  return (
    <>
      <NavbarLink key="members" link={`/${lang}/members`} id="members-link">
        {translation("links.members")}
      </NavbarLink>
      {!isAuthenticated && (
        <NavbarLink key="signIn" link={`/${lang}/sign-in`} id="sign-in-link">
          {translation("links.sign-in")}
        </NavbarLink>
      )}
      {!isAuthenticated && (
        <NavbarLink key="signUp" link={`/${lang}/sign-up`} id="sign-up-link">
          {translation("links.sign-up")}
        </NavbarLink>
      )}
      {isAuthenticated && (
        <li className="self-end sm:self-center" id="notifications-link">
          <Notifications key="notifications" lang={lang} onClick={onClick} />
        </li>
      )}
      {isAuthenticated && (
        <li className="self-end justify-self-end" id="current-user-link">
          <CurrentUser
            key="currentUser"
            lang={lang}
            firstName={user?.firstName ?? "Unknown"}
            avatarUrl={user?.avatarPath ?? undefined}
            onClick={onClick}
          />
        </li>
      )}
    </>
  );
};

export default NavbarItems;
