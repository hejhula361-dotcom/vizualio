import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageIcon } from "lucide-react";

import { requireAdmin } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/app/admin/_components/PageHeader";
import { Badge } from "@/app/admin/_components/Badge";
import { GlassCard, GlassCardHeader, GlassCardBody } from "@/app/admin/_components/GlassCard";
import { EmptyState } from "@/app/admin/_components/EmptyState";

export const dynamic = "force-dynamic";

export default async function AdminProjectDetailPage({ params }: { params: { projectId: string } }) {
  await requireAdmin(["superadmin", "admin"]);

  const supabase = getSupabaseAdmin();
  const projectId = params.projectId;

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, client_id, project_name, order_status, created_at, delivered_at")
    .eq("id", projectId)
    .single();
  if (projectError) notFound();

  const { data: client } = await supabase
    .from("clients")
    .select("id, name, email")
    .eq("id", project.client_id)
    .single();

  return (
    <div className="space-y-8">
      <PageHeader
        title={project.project_name}
        description={client ? `Klient: ${client.name}` : "Projekt"}
        badge={<Badge variant="neutral">{project.order_status}</Badge>}
      />

      <div className="content-card">
        <p className="text-sm text-stone uppercase tracking-[0.2em]">Detail</p>
        <div className="mt-3 grid gap-2 text-sm text-offwhite/90">
          <div>
            <span className="text-stone">Vytvořeno:</span>{" "}
            {new Date(project.created_at as string).toLocaleString("cs-CZ")}
          </div>
          {client && (
            <div>
              <span className="text-stone">Klient:</span>{" "}
              <Link className="text-champagne hover:text-amber" href={`/admin/clients/${client.id}`}>
                {client.name}
              </Link>{" "}
              <span className="text-stone">{client.email ? `(${client.email})` : ""}</span>
            </div>
          )}
        </div>
      </div>

      <GlassCard>
        <GlassCardHeader icon={<ImageIcon className="h-4 w-4 text-champagne" />}>Fotky</GlassCardHeader>
        <GlassCardBody>
          <EmptyState
            icon={ImageIcon}
            title="Nahrávání a doručení fotek"
            description="Tahle část se doplní v dalším kroku (upload admin + gallery klient)."
          />
        </GlassCardBody>
      </GlassCard>
    </div>
  );
}

