import { ReactNode } from "react";

import Notifications from "./notifications";
import CurrentUser from "./current-user";

export interface INavbarLink {
  id: number;
  label: {
    en: string;
    ru: string;
  };
  link: string;
  displayCase: "always" | "authenticated" | "not-authenticated";
}

export interface INavbarComponent {
  id: number;
  displayCase: "always" | "authenticated" | "not-authenticated";
  component?: ReactNode;
}

const navbarItems: (INavbarLink | INavbarComponent)[] = [
  {
    id: 1,
    label: { en: "Lectures", ru: "Лекции" },
    link: "/lectures",
    displayCase: "always",
  },
  {
    id: 2,
    label: { en: "Sign In", ru: "Войти" },
    link: "/sign-in",
    displayCase: "not-authenticated",
  },
  {
    id: 3,
    label: { en: "Sign Up", ru: "Регистрация" },
    link: "/sign-up",
    displayCase: "not-authenticated",
  },
  {
    id: 4,
    component: (
      <div className="flex mt-auto justify-between items-center px-3 sm:px-0">
        <Notifications />
        <CurrentUser />
      </div>
    ),
    displayCase: "authenticated",
  },
];

export const isNavbarComponent = (
  navbarItem: INavbarLink | INavbarComponent
): navbarItem is INavbarComponent => "component" in navbarItem;

export default navbarItems;
