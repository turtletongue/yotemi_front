"use client";

import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface MobileNavbarProps {
  isOpened: boolean;
  children?: ReactNode;
}

const MobileNavbar = ({ isOpened, children }: MobileNavbarProps) => {
  return (
    <Transition show={isOpened} appear as={Fragment}>
      <Dialog open={isOpened} onClose={() => {}} className="relative">
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-card p-6 text-left shadow-md transition-all">
                <ul className="mobile-navbar-items grid w-full h-full">
                  {children}
                </ul>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MobileNavbar;
