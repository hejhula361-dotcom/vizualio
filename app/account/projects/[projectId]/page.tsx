import { notFound } from "next/navigation";
import { ImageIcon } from "lucide-react";

import { requireClient } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/app/admin/_components/PageHeader";
import { Badge } from "@/app/admin/_components/Badge";
import { GlassCard, GlassCardHeader, GlassCardBody } from "@/app/admin/_components/GlassCard";
import { EmptyState } from "@/app/admin/_components/EmptyState";

export const dynamic = "force-dynamic";

export default async function AccountProjectPage({ params }: { params: { projectId: string } }) {
  const session = await requireClient();
  const clientId = (session.user as any).clientId as string | undefined;
  if (!clientId) notFound();

  const supabase = getSupabaseAdmin();
  const { data: project, error } = await supabase
    .from("projects")
    .select("id, project_name, order_status, created_at, delivered_at")
    .eq("id", params.projectId)
    .eq("client_id", clientId)
    .single();

  if (error) notFound();

  return (
    <div className="section-container">
      <PageHeader
        title={project.project_name}
        description="Detail projektu"
        badge={<Badge variant="neutral">{project.order_status}</Badge>}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="content-card">
          <p className="text-sm text-stone uppercase tracking-[0.2em]">Stav</p>
          <div className="mt-3 space-y-2 text-sm text-offwhite/90">
            <div>
              <span className="text-stone">Status:</span> {project.order_status}
            </div>
            <div>
              <span className="text-stone">Vytvořeno:</span>{" "}
              {new Date(project.created_at as string).toLocaleString("cs-CZ")}
            </div>
            {project.delivered_at && (
              <div>
                <span className="text-stone">Doručeno:</span>{" "}
                {new Date(project.delivered_at as string).toLocaleString("cs-CZ")}
              </div>
            )}
          </div>
        </div>

        <div className="content-card">
          <p className="text-sm text-stone uppercase tracking-[0.2em]">Hodnocení</p>
          <p className="mt-2 text-sm text-stone">Doplníme v dalším kroku (1–5 hvězdiček + text).</p>
        </div>
      </div>

      <div className="mt-8">
        <GlassCard>
          <GlassCardHeader icon={<ImageIcon className="h-4 w-4 text-champagne" />}>Fotky</GlassCardHeader>
          <GlassCardBody>
            <EmptyState
              icon={ImageIcon}
              title="Galerie a stažení"
              description="Doplníme v dalším kroku (signed URL + download)."
            />
          </GlassCardBody>
        </GlassCard>
      </div>
    </div>
  );
}

