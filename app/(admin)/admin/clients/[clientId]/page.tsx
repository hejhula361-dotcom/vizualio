import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase } from "lucide-react";

import { requireAdmin } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/app/admin/_components/PageHeader";
import { GlassCard, GlassCardHeader, GlassCardBody } from "@/app/admin/_components/GlassCard";
import { EmptyState } from "@/app/admin/_components/EmptyState";
import { Badge } from "@/app/admin/_components/Badge";
import { ClientCredentialsCard } from "@/app/(admin)/admin/clients/_components/ClientCredentialsCard";
import { CreateProjectForm } from "@/app/(admin)/admin/clients/_components/CreateProjectForm";

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

export default async function AdminClientDetailPage({ params }: { params: { clientId: string } }) {
  await requireAdmin(["superadmin", "admin"]);

  const supabase = getSupabaseAdmin();
  const clientId = params.clientId;

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, name, email, status, created_at")
    .eq("id", clientId)
    .single();
  if (clientError) notFound();

  const { data: authRow } = await supabase
    .from("client_auth")
    .select("username")
    .eq("client_id", clientId)
    .maybeSingle();

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, project_name, order_status, created_at")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (projectsError) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        Chyba při načítání projektů: {projectsError.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={client.name}
        description={client.email ?? "—"}
        badge={<Badge variant={client.status === "active" ? "success" : "neutral"}>{client.status}</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ClientCredentialsCard clientId={clientId} username={(authRow?.username as string) ?? null} />
        <CreateProjectForm clientId={clientId} />
      </div>

      <div>
        <GlassCard>
          <GlassCardHeader>Projekty</GlassCardHeader>
          <GlassCardBody>
            {(projects ?? []).length === 0 && (
              <EmptyState
                icon={Briefcase}
                title="Zatím žádné projekty"
                description="Vytvořte první projekt pro tohoto klienta."
              />
            )}

            {(projects ?? []).map((p) => (
              <Link
                key={p.id}
                href={`/admin/projects/${p.id}`}
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

