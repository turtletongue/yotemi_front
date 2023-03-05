import classnames from "classnames";

interface ButtonProps {
  className?: string;
  animated?: boolean;
  children: string;
}

const Button = ({
  className = "w-40 h-12",
  animated = false,
  children,
}: ButtonProps) => {
  return (
    <button
      className={`group rounded-full bg-blue-pink-pink-gradient bg-300% bg-full ${classnames(
        animated && "hover:animate-gradient-ellipse"
      )} p-1 ${className}`}
      aria-label={children}
    >
      <div className="rounded-full bg-space-cadet w-full h-full flex items-center justify-center">
        <span
          className={`bg-blue-pink-pink-gradient bg-300% bg-full ${classnames(
            animated && "group-hover:animate-gradient-ellipse"
          )} bg-clip-text text-transparent text-sm tracking-widest uppercase`}
        >
          {children}
        </span>
      </div>
    </button>
  );
};

export default Button;
