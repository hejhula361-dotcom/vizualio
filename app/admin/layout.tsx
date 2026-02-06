import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Vizualio",
  description: "Administrace Vizualio"
};

/** Root admin layout – bez auth, aby /admin/login nepadal do redirect smyčky. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
