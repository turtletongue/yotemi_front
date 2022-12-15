import { MouseEventHandler } from "react";
import Link from "next/link";
import { ArrowRight } from "react-feather";

interface NavbarLinkProps {
  link?: string;
  onClick?: MouseEventHandler;
  children: string;
}

const NavbarLink = ({ link = "#", onClick, children }: NavbarLinkProps) => {
  return (
    <li onClick={onClick}>
      <Link
        href={link}
        className="font-roboto font-bold text-lg sm:text-base sm:font-normal text-white my-3 sm:my-0 px-3 flex sm:block w-full sm:w-auto items-center justify-between cursor-pointer"
      >
        {children}
        <ArrowRight className="sm:hidden" />
      </Link>
    </li>
  );
};

export default NavbarLink;
