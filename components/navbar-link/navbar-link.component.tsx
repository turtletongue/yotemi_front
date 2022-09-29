import Link from 'next/link';

interface NavbarLinkProps {
  link?: string;
  children: string;
}

const NavbarLink = ({ link, children }: NavbarLinkProps) => {
  return (
    <li className="font-roboto text-white text-lg px-3">
      {link ? <Link href={link}>{children}</Link> : children}
    </li>
  );
};

export default NavbarLink;
