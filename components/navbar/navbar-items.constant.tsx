import { ReactNode } from 'react';

export interface NavbarLink {
  id: number;
  label: {
    en: string;
    ru: string;
  };
  link: string;
  display: 'always' | 'authenticated' | 'not-authenticated';
}

export interface NavbarComponent {
  id: number;
  display: 'always' | 'authenticated' | 'not-authenticated';
  component?: ReactNode;
}

const navbarItems: (NavbarLink | NavbarComponent)[] = [
  {
    id: 1,
    label: { en: 'Lectures', ru: 'Лекции' },
    link: '/lectures',
    display: 'always',
  },
  {
    id: 2,
    label: { en: 'Profile', ru: 'Профиль' },
    link: '/profile',
    display: 'authenticated',
  },
  {
    id: 3,
    label: { en: 'Sign In', ru: 'Войти' },
    link: '/sign-in',
    display: 'not-authenticated',
  },
  {
    id: 4,
    label: { en: 'Sign Up', ru: 'Регистрация' },
    link: '/sign-up',
    display: 'not-authenticated',
  },
  {
    id: 5,
    component: <div />,
    display: 'authenticated',
  },
  {
    id: 6,
    component: <div />,
    display: 'authenticated',
  },
];

export const isNavbarComponent = (
  navbarItem: NavbarLink | NavbarComponent
): navbarItem is NavbarComponent => 'component' in navbarItem;

export default navbarItems;
