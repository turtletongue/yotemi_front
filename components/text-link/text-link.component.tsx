import Link from "next/link";

interface TextLinkProps {
  href: string;
  target?: string;
  children?: string | null;
}

const TextLink = ({ href, target, children }: TextLinkProps) => {
  return (
    <span>
      <Link
        href={href}
        target={target}
        className="bg-blue-blue-pink-gradient bg-clip-text relative text-transparent after:content-['']1 after:bg-blue-blue-pink-gradient after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full"
      >
        {children}
      </Link>
    </span>
  );
};

export default TextLink;
