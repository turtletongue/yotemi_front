import { ReactNode } from "react";

import { fonts } from "@utils";

interface ButtonProps {
  className?: string;
  textSize?: "xs" | "sm" | "md" | "xl" | "2xl" | "3xl";
  disableDefaultFlex?: boolean;
  disableDefaultSize?: boolean;
  children: ReactNode;
}

const Button = ({
  className = "",
  textSize = "md",
  disableDefaultFlex = false,
  children,
}: ButtonProps) => {
  const flexClasses = !disableDefaultFlex
    ? "flex items-center justify-center"
    : "";

  return (
    <button className={`rounded-full bg-simple-blue-gradient p-1 ${className}`}>
      <div
        className={`rounded-full bg-space-cadet w-full h-full ${flexClasses}`}
      >
        <span
          className={`font-secular ${fonts.secularOne.variable} bg-simple-blue-gradient bg-clip-text text-transparent text-${textSize}`}
        >
          {children}
        </span>
      </div>
    </button>
  );
};

export default Button;
