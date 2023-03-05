interface ButtonProps {
  className?: string;
  children: string;
}

const Button = ({ className = "", children }: ButtonProps) => {
  return (
    <button
      className={`group rounded-full bg-blue-pink-pink-gradient bg-300% bg-full hover:animate-gradient-ellipse p-1 ${className}`}
      aria-label={children}
    >
      <div className="rounded-full bg-space-cadet w-full h-full flex items-center justify-center">
        <span
          className={`bg-blue-pink-pink-gradient bg-300% bg-full group-hover:animate-gradient-ellipse bg-clip-text text-transparent text-sm tracking-widest uppercase`}
        >
          {children}
        </span>
      </div>
    </button>
  );
};

export default Button;
