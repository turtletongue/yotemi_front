import Link from "next/link";
import { ArrowRight } from "react-feather";

interface NavbarLinkProps {
  link?: string;
  children: string;
}

const NavbarLink = ({ link = "#", children }: NavbarLinkProps) => {
  return (
    <li>
      <Link
        href={link}
        className="font-roboto font-medium sm:font-normal sm:text-white my-3 sm:my-0 text-lg px-3 flex sm:block w-full sm:w-auto justify-between cursor-pointer"
      >
        {children}
        <ArrowRight className="sm:hidden" />
      </Link>
    </li>
  );
};

export default NavbarLink;
