import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import Logo from '../logo';
import NavbarLink from '../navbar-link';
import GradientLine from '../graident-line';
import MobileNavbarControll from '../mobile-navbar-controll';

import navbarItems, { isNavbarComponent } from './navbar-items.constant';

const Navbar = () => {
  const authenticationState = 'not-authenticated';
  const locale = 'en';

  const [isMobileNavbarOpened, setIsMobileNavbarOpened] = useState(false);

  const displayedItems = navbarItems.filter((navbarItem) => {
    return (
      navbarItem.display === 'always' ||
      navbarItem.display === authenticationState
    );
  });

  const displayedComponents = displayedItems.map((navbarItem) => {
    const component = isNavbarComponent(navbarItem) ? (
      navbarItem.component
    ) : (
      <NavbarLink link={navbarItem.link}>{navbarItem.label[locale]}</NavbarLink>
    );

    return <Fragment key={navbarItem.id}>{component}</Fragment>;
  });

  const leftComponents = displayedComponents.slice(0, -2);
  const rightComponents = displayedComponents.slice(-2);

  return (
    <>
      <nav className="bg-yankees-blue w-full h-14 flex items-center px-5 relative z-20">
        <Logo />
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
          onClose={() => {}}
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
                  <ul className="w-full flex flex-col">
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

export default Navbar;
