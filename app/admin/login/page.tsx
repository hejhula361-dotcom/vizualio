import { AdminLoginClient } from "@/app/admin/login/_components/AdminLoginClient";

export default function AdminLoginPage({ searchParams }: { searchParams?: { from?: string } }) {
  return <AdminLoginClient from={searchParams?.from || "/admin"} />;
}

