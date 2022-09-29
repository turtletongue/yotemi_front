import { Fragment } from 'react';

import Logo from '@components/logo';
import NavbarLink from '@components/navbar-link';

import navbarItems, { isNavbarComponent } from './navbar-items.constant';

const Navbar = () => {
  const authenticationState = 'not-authenticated';
  const locale = 'en';

  const renderedNavbarItems = navbarItems.filter((navbarItem) => {
    return (
      navbarItem.display === 'always' ||
      navbarItem.display === authenticationState
    );
  });

  const items = renderedNavbarItems.map((navbarItem) => {
    const component = isNavbarComponent(navbarItem) ? (
      navbarItem.component
    ) : (
      <NavbarLink link={navbarItem.link}>{navbarItem.label[locale]}</NavbarLink>
    );

    return <Fragment key={navbarItem.id}>{component}</Fragment>;
  });

  const leftItems = items.slice(0, -2);
  const rightItems = items.slice(-2);

  return (
    <nav className="bg-yankees-blue w-full h-14 flex items-center px-5">
      <Logo />
      <div className="flex items-center w-full justify-between ml-10">
        <ul className="flex items-center">{leftItems}</ul>
        <ul className="flex items-center">{rightItems}</ul>
      </div>
    </nav>
  );
};

export default Navbar;
