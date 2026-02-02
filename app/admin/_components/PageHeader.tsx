import { type ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  badge?: ReactNode;
};

export function PageHeader({ title, description, badge }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        <h2 className="page-header-title">{title}</h2>
        {description && <p className="page-header-desc">{description}</p>}
      </div>
      {badge != null && <span className="page-header-badge">{badge}</span>}
    </div>
  );
}
