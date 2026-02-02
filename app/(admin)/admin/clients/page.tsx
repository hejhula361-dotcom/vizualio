import Link from "next/link";
import { Users } from "lucide-react";

import { requireAdmin } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/app/admin/_components/PageHeader";
import { GlassCard, GlassCardHeader, GlassCardBody } from "@/app/admin/_components/GlassCard";
import { EmptyState } from "@/app/admin/_components/EmptyState";
import { Badge } from "@/app/admin/_components/Badge";
import { CreateClientForm } from "@/app/(admin)/admin/clients/_components/CreateClientForm";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  await requireAdmin(["superadmin", "admin"]);

  const supabase = getSupabaseAdmin();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, name, email, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        Chyba při načítání klientů: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <PageHeader
          title="Klienti"
          description="Správa klientů a jejich projektů"
          badge={<>{clients?.length ?? 0} klientů</>}
        />

        <div className="mt-6">
          <GlassCard>
            <GlassCardHeader>Seznam klientů</GlassCardHeader>
            <GlassCardBody>
              {(clients ?? []).length === 0 && (
                <EmptyState
                  icon={Users}
                  title="Zatím žádní klienti"
                  description="Vytvořte prvního klienta pomocí formuláře níže."
                />
              )}

              {(clients ?? []).map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/clients/${c.id}`}
                  className="table-row flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-offwhite">{c.name}</p>
                    <p className="text-xs text-stone">{c.email || "—"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={c.status === "active" ? "success" : "neutral"}>{c.status}</Badge>
                    <span className="text-xs text-stone">
                      {new Date(c.created_at as string).toLocaleDateString("cs-CZ")}
                    </span>
                  </div>
                </Link>
              ))}
            </GlassCardBody>
          </GlassCard>
        </div>
      </div>

      <CreateClientForm />
    </div>
  );
}

