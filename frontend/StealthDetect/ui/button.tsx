import { forwardRef } from "react";
import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from "react";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "default",
      size = "md",
      ...rest
    },
    ref,
  ) => {
    const base = "inline-flex items-center justify-center font-medium";
    const variants: Record<string, string> = {
      default: "",
      outline: "border",
      ghost: "bg-transparent",
    };
    const sizes: Record<string, string> = {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
