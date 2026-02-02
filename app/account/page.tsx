import Link from "next/link";
import { Briefcase } from "lucide-react";

import { requireClient } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/app/admin/_components/PageHeader";
import { GlassCard, GlassCardHeader, GlassCardBody } from "@/app/admin/_components/GlassCard";
import { EmptyState } from "@/app/admin/_components/EmptyState";
import { Badge } from "@/app/admin/_components/Badge";

export const dynamic = "force-dynamic";

type OrderStatus = "new" | "in_progress" | "waiting_client" | "done" | "delivered" | "cancelled";

function statusVariant(status: OrderStatus) {
  switch (status) {
    case "delivered":
    case "done":
      return "success" as const;
    case "cancelled":
      return "error" as const;
    case "waiting_client":
      return "accent" as const;
    case "in_progress":
    case "new":
    default:
      return "warning" as const;
  }
}

export default async function AccountPage() {
  const session = await requireClient();
  const clientId = (session.user as any).clientId as string | undefined;
  if (!clientId) {
    return (
      <div className="content-card">
        <p className="text-offwhite">Chybí clientId v session. Zkuste se prosím odhlásit a přihlásit znovu.</p>
      </div>
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, project_name, order_status, created_at")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        Chyba při načítání projektů: {error.message}
      </div>
    );
  }

  return (
    <div className="section-container">
      <PageHeader
        title="Moje projekty"
        description="Přehled vašich zakázek a doručených vizualizací"
        badge={<>{projects?.length ?? 0} projektů</>}
      />

      <div className="mt-6">
        <GlassCard>
          <GlassCardHeader>Projekty</GlassCardHeader>
          <GlassCardBody>
            {(projects ?? []).length === 0 && (
              <EmptyState
                icon={Briefcase}
                title="Zatím žádné projekty"
                description="Jakmile pro vás vytvoříme projekt, objeví se tady."
              />
            )}

            {(projects ?? []).map((p) => (
              <Link
                key={p.id}
                href={`/account/projects/${p.id}`}
                className="table-row flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-offwhite">{p.project_name}</p>
                  <p className="text-xs text-stone">
                    {new Date(p.created_at as string).toLocaleDateString("cs-CZ")}
                  </p>
                </div>
                <Badge variant={statusVariant(p.order_status as OrderStatus)}>{p.order_status}</Badge>
              </Link>
            ))}
          </GlassCardBody>
        </GlassCard>
      </div>
    </div>
  );
}

