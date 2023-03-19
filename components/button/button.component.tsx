import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  addition?: string | number;
  outline?: boolean;
  onClick?: MouseEventHandler;
  children: ReactNode;
}

const Button = ({ addition, outline, onClick, children }: ButtonProps) => {
  const additionStyling = addition
    ? "rounded-l-full pr-3"
    : "rounded-full pr-5";
  const outlineStyling = outline
    ? "bg-transparent border-2 border-vivid-medium text-vivid-medium"
    : "bg-vivid-light hover:bg-vivid-dark";

  return (
    <div className="flex max-h-9 font-medium">
      <button
        className={`${additionStyling} ${outlineStyling} py-1 pl-5 transition ease-in-out duration-100`}
        onClick={onClick}
      >
        {children}
      </button>
      {addition && (
        <span className="flex items-center bg-vivid-medium py-1 pl-3 pr-4 rounded-r-full text-sm">
          {addition}
        </span>
      )}
    </div>
  );
};

export default Button;
