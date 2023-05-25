"use client";

import { MouseEventHandler, Suspense } from "react";
import { Bell } from "react-feather";
import classnames from "classnames";

import { LanguageSwitcher, NotificationsPopover } from "@components";
import { useAppSelector } from "@store/store-config/hooks";
import { selectIsAuthenticated, selectUser } from "@store/features/auth";
import { useGetUserQuery } from "@store/features/users";
import { Language, useTranslation } from "@app/i18n/client";
import NavbarLink from "../navbar-link";
import CurrentUser from "../current-user";
import CurrentUserSkeleton from "../current-user-skeleton";

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
      <div
        className={classnames(
          "flex sm:flex-row gap-4 items-center w-fit",
          isAuthenticated && user && "flex-row-reverse"
        )}
        id="language-and-bell-block"
      >
        <LanguageSwitcher lang={lang} />
        {isAuthenticated && user && (
          <Suspense
            fallback={
              <Bell className="sm:text-gray-400 animate-pulse sm:self-center mr-5" />
            }
          >
            <li className="sm:self-center">
              <NotificationsPopover
                key="notifications"
                lang={lang}
                onClick={onClick}
              />
            </li>
          </Suspense>
        )}
      </div>
      {isAuthenticated && user && (
        <Suspense
          fallback={
            <CurrentUserSkeleton
              className="self-center justify-self-end"
              id="current-user-link"
            />
          }
        >
          <li className="self-center justify-self-end" id="current-user-link">
            <CurrentUser
              key="currentUser"
              lang={lang}
              firstName={user?.firstName ?? ""}
              username={user?.username}
              avatarUrl={user?.avatarPath ?? null}
              onClick={onClick}
            />
          </li>
        </Suspense>
      )}
    </>
  );
};

export default NavbarItems;
