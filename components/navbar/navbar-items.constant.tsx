import { MouseEventHandler, ReactNode } from "react";

import Notifications from "./notifications";
import CurrentUser from "./current-user";

export interface INavbarLink {
  id: number;
  label: string;
  link: string;
  displayCase: "always" | "authenticated" | "not-authenticated";
}

export interface INavbarComponent {
  id: number;
  displayCase: "always" | "authenticated" | "not-authenticated";
  component?: ReactNode;
}

const getNavbarItems = (
  lang: "en" | "ru",
  clickHandler?: MouseEventHandler
): (INavbarLink | INavbarComponent)[] => [
  {
    id: 1,
    label: { en: "Lectures", ru: "Лекции" }[lang],
    link: `/${lang}/lectures`,
    displayCase: "always",
  },
  {
    id: 2,
    label: { en: "Sign In", ru: "Войти" }[lang],
    link: `/${lang}/sign-in`,
    displayCase: "not-authenticated",
  },
  {
    id: 3,
    label: { en: "Sign Up", ru: "Регистрация" }[lang],
    link: `/${lang}/sign-up`,
    displayCase: "not-authenticated",
  },
  {
    id: 4,
    component: (
      <div className="flex mt-auto justify-between items-center px-3 sm:px-0">
        <Notifications lang={lang} onClick={clickHandler} />
        <CurrentUser lang={lang} onClick={clickHandler} />
      </div>
    ),
    displayCase: "authenticated",
  },
];

export const isNavbarComponent = (
  navbarItem: INavbarLink | INavbarComponent
): navbarItem is INavbarComponent => "component" in navbarItem;

export default getNavbarItems;
