"use client";

import { MouseEventHandler } from "react";
import Link from "next/link";
import { ArrowRight } from "react-feather";

interface NavbarLinkProps {
  link?: string;
  id?: string;
  onClick?: MouseEventHandler;
  children: string;
}

const NavbarLink = ({ link = "#", id, onClick, children }: NavbarLinkProps) => {
  return (
    <li
      className="font-bold text-lg sm:text-base sm:font-medium text-white my-3 sm:my-0 px-3 flex sm:items-center cursor-pointer"
      onClick={onClick}
      id={id}
    >
      <Link href={link} className="flex justify-between w-full sm:w-auto">
        {children}
        <ArrowRight className="sm:hidden" />
      </Link>
    </li>
  );
};

export default NavbarLink;
