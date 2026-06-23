import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "gold" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#303e39] text-white hover:bg-[#303e39]/90 active:bg-[#303e39]/80 shadow-sm",
  secondary:
    "bg-[#e1dcd0] text-[#111] hover:bg-[#e1dcd0]/80 active:bg-[#e1dcd0]/70",
  ghost:
    "bg-transparent text-[#111] hover:bg-[#e1dcd0]/40 active:bg-[#e1dcd0]/60",
  accent:
    "bg-[#c25b3e] text-white hover:bg-[#c25b3e]/90 active:bg-[#c25b3e]/80 shadow-sm",
  gold:
    "bg-[#d4a85c] text-white hover:bg-[#d4a85c]/90 active:bg-[#d4a85c]/80 shadow-sm",
  outline:
    "bg-transparent border border-[#111] text-[#111] hover:bg-[#111] hover:text-white active:bg-[#111]/90",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, href, loading, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;

    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none",
      variantStyles[variant],
      sizeStyles[size],
      className,
    );

    if (href) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} disabled={isDisabled} className={classes} {...props}>
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
export default Button;
