import { type ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return <div className={`glass-card ${className}`}>{children}</div>;
}

type GlassCardHeaderProps = {
  children: ReactNode;
  icon?: React.ReactNode;
};

export function GlassCardHeader({ children, icon }: GlassCardHeaderProps) {
  return (
    <div className="glass-card-header">
      <span>{children}</span>
      {icon}
    </div>
  );
}

export function GlassCardBody({ children }: { children: ReactNode }) {
  return <div className="glass-card-body">{children}</div>;
}
