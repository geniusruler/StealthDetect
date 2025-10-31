import type { ReactNode } from "react";

interface BadgeProps {
  children?: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost";
}

export function Badge({ children, className = "", variant = "default" }: BadgeProps) {
  const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-border",
    secondary: "bg-muted text-muted-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    ghost: "bg-transparent",
  };

  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
}

export default Badge;
