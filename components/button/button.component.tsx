import { MouseEventHandler, ReactNode } from "react";
import classnames from "classnames";

interface ButtonProps {
  addition?: string | number;
  outline?: boolean;
  color?: "primary" | "danger";
  disabled?: boolean;
  onClick?: MouseEventHandler;
  className?: string;
  children: ReactNode;
}

const Button = ({
  addition,
  outline,
  color = "primary",
  disabled = false,
  onClick,
  className = "",
  children,
}: ButtonProps) => {
  const colors = {
    primary: {
      outline: "border-vivid-medium text-vivid-medium",
      normal: `bg-vivid-light ${classnames(
        !disabled && "hover:bg-vivid-dark"
      )}`,
    },
    danger: {
      outline: "border-danger text-danger",
      normal: `bg-danger ${classnames(!disabled && "hover:bg-danger-dark")}`,
    },
  } as const;

  const additionStyling =
    addition !== undefined ? "rounded-l-full pr-3" : "rounded-full pr-5";
  const outlineStyling = outline
    ? `bg-transparent border-2 ${colors[color].outline}`
    : `${colors[color].normal}`;

  return (
    <div
      className={`flex max-h-9 font-medium ${classnames(
        disabled && "opacity-70"
      )}`}
    >
      <button
        className={`${additionStyling} ${outlineStyling} ${className} py-2 pl-5 text-sm sm:text-base flex items-center`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
      {addition !== undefined && (
        <span
          className={`flex items-center ${
            color === "primary" ? "bg-vivid-medium" : "bg-danger"
          } py-1 pl-3 pr-4 rounded-r-full text-sm`}
        >
          {addition}
        </span>
      )}
    </div>
  );
};

export default Button;
