import { type ReactNode } from "react";

type BadgeVariant = "neutral" | "accent" | "success" | "warning" | "error";

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "badge badge-neutral",
  accent: "badge badge-accent",
  success: "badge badge-success",
  warning: "badge badge-warning",
  error: "badge badge-error"
};

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return <span className={`${variantClasses[variant]} ${className}`.trim()}>{children}</span>;
}
