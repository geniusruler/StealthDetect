import type { DetailedHTMLProps, HTMLAttributes } from "react";

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export function Card({ children, className = "", ...rest }: DivProps) {
  return (
    <div className={`bg-card rounded-lg border ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...rest }: DivProps) {
  return (
    <div className={`p-4 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...rest }: DivProps) {
  return (
    <div className={`p-3 border-b ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...rest }: DivProps) {
  return (
    <div className={`font-medium ${className}`} {...rest}>
      {children}
    </div>
  );
}

export default Card;
