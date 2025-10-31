import type {
  DetailedHTMLProps,
  LabelHTMLAttributes,
} from "react";

type LabelProps = DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

export function Label({ children, className = "", ...rest }: LabelProps) {
  return (
    <label className={`text-sm font-medium ${className}`} {...rest}>
      {children}
    </label>
  );
}

export default Label;
