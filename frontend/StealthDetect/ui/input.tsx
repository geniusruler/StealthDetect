import { forwardRef } from "react";
import type {
  DetailedHTMLProps,
  InputHTMLAttributes,
} from "react";

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`border rounded-md px-3 py-2 bg-transparent focus:outline-none ${className}`}
      {...props}
    />
  ),
);

Input.displayName = "Input";

export default Input;
