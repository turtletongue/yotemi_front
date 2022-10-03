import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowRight } from 'react-feather';

interface NavbarLinkProps {
  link?: string;
  children: string;
}

const NavbarLink = ({ link, children }: NavbarLinkProps) => {
  const router = useRouter();

  const navigateToLink = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <li
      className="font-roboto font-medium sm:font-normal sm:text-white my-3 sm:my-0 text-lg px-3 flex sm:block w-full sm:w-auto justify-between cursor-pointer"
      onClick={navigateToLink}
    >
      {link ? <Link href="link">{children}</Link> : children}
      <ArrowRight className="sm:hidden" />
    </li>
  );
};

export default NavbarLink;
