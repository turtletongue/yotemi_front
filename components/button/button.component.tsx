interface ButtonProps {
  className?: string;
  textSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  font?: string;
  disableDefaultFlex?: boolean;
  disableDefaultSize?: boolean;
  children: string;
}

const Button = ({
  className = "",
  disableDefaultFlex = false,
  children,
}: ButtonProps) => {
  const flexClasses = !disableDefaultFlex
    ? "flex items-center justify-center"
    : "";

  return (
    <button
      className={`rounded-full bg-simple-blue-gradient p-1 ${className}`}
      aria-label={children}
    >
      <div
        className={`rounded-full bg-space-cadet w-full h-full ${flexClasses}`}
      >
        <span
          className={`bg-simple-blue-gradient bg-clip-text text-transparent text-xl`}
        >
          {children}
        </span>
      </div>
    </button>
  );
};

export default Button;
