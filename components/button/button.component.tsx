interface ButtonProps {
  className?: string;
  children: string;
}

const Button = ({ className = "", children }: ButtonProps) => {
  return (
    <button
      className={`rounded-full bg-simple-blue-gradient p-1 ${className}`}
      aria-label={children}
    >
      <div className="rounded-full bg-space-cadet w-full h-full flex items-center justify-center">
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
