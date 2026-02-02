import { ClientLoginClient } from "@/app/login/_components/ClientLoginClient";

export default function ClientLoginPage({ searchParams }: { searchParams?: { from?: string } }) {
  return <ClientLoginClient from={searchParams?.from || "/account"} />;
}

