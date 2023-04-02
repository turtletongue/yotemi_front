import classnames from "classnames";

interface ButtonProps {
  className?: string;
  animated?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string | null;
  children: string;
}

const GradientButton = ({
  className = "w-40 h-12",
  animated = false,
  disabled = false,
  loading = false,
  loadingText = "Loading...",
  children,
}: ButtonProps) => {
  const disableClass = classnames(disabled && "opacity-70");
  const cursorClass = classnames(!disabled && "cursor-pointer");
  const animateBorderClass = classnames(
    animated && !disabled && "hover:animate-gradient-ellipse"
  );
  const animateTextClass = classnames(
    animated && !disabled && "group-hover:animate-gradient-ellipse"
  );

  return (
    <button
      className={`group rounded-full bg-blue-pink-pink-gradient bg-300% bg-full ${cursorClass} ${animateBorderClass} ${disableClass} p-1 ${className}`}
      aria-label={children}
      disabled={disabled}
    >
      <div className="rounded-full bg-space-cadet w-full h-full flex items-center justify-center">
        <span
          className={`bg-blue-pink-pink-gradient bg-300% bg-full ${animateTextClass} bg-clip-text text-transparent text-sm tracking-widest uppercase`}
        >
          {loading ? loadingText : children}
        </span>
      </div>
    </button>
  );
};

export default GradientButton;
