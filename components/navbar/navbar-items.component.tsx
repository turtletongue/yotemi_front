"use client";

import { MouseEventHandler } from "react";

import { NotificationsPopover } from "@components";
import { useAppSelector } from "@redux/store-config/hooks";
import { selectIsAuthenticated, selectUser } from "@redux/features/auth";
import { useGetUserQuery } from "@redux/features/users";
import { Language, useTranslation } from "@app/i18n/client";
import NavbarLink from "../navbar-link";
import CurrentUser from "../current-user";

interface NavbarItemsProps {
  lang: Language;
  onClick?: MouseEventHandler;
}

const NavbarItems = ({ lang, onClick }: NavbarItemsProps) => {
  const { translation } = useTranslation(lang, "navbar");

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authenticatedUser = useAppSelector(selectUser);

  const { data: user } = useGetUserQuery(authenticatedUser?.id!, {
    skip: !authenticatedUser,
  });

  return (
    <>
      <NavbarLink
        key="members"
        link={`/${lang}/members`}
        id="members-link"
        onClick={onClick}
      >
        {translation("links.members")}
      </NavbarLink>
      {isAuthenticated && (
        <NavbarLink
          key="upcoming"
          link={`/${lang}/upcoming`}
          id="upcoming-link"
          onClick={onClick}
        >
          {translation("links.upcoming")}
        </NavbarLink>
      )}
      {!isAuthenticated && (
        <NavbarLink
          key="signIn"
          link={`/${lang}/sign-in`}
          id="sign-in-link"
          onClick={onClick}
        >
          {translation("links.sign-in")}
        </NavbarLink>
      )}
      {!isAuthenticated && (
        <NavbarLink
          key="signUp"
          link={`/${lang}/sign-up`}
          id="sign-up-link"
          onClick={onClick}
        >
          {translation("links.sign-up")}
        </NavbarLink>
      )}
      {isAuthenticated && user && (
        <li className="self-end sm:self-center" id="notifications-link">
          <NotificationsPopover
            key="notifications"
            lang={lang}
            onClick={onClick}
          />
        </li>
      )}
      {isAuthenticated && user && (
        <li className="self-end justify-self-end" id="current-user-link">
          <CurrentUser
            key="currentUser"
            lang={lang}
            firstName={user?.firstName ?? ""}
            username={user?.username}
            avatarUrl={user?.avatarPath ?? null}
            onClick={onClick}
          />
        </li>
      )}
    </>
  );
};

export default NavbarItems;
