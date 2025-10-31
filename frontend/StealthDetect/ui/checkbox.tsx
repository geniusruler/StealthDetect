import { forwardRef } from "react";
import type {
  DetailedHTMLProps,
  InputHTMLAttributes,
} from "react";

type CheckboxChangeHandler = (checked: boolean | "indeterminate") => void;

type CheckboxProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  onCheckedChange?: CheckboxChangeHandler;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ onCheckedChange, className = "", ...rest }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={`w-5 h-5 rounded ${className}`}
      onChange={(event) =>
        onCheckedChange?.(event.currentTarget.checked)
      }
      {...rest}
    />
  ),
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
