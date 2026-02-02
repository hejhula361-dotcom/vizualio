import { notFound } from "next/navigation";
import { ImageIcon } from "lucide-react";

import { requireClient } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/app/admin/_components/PageHeader";
import { Badge } from "@/app/admin/_components/Badge";
import { GlassCard, GlassCardHeader } from "@/app/admin/_components/GlassCard";
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

  const { data: photos, error: photosError } = await supabase
    .from("project_photos")
    .select("id, storage_path, original_filename, uploaded_at")
    .eq("project_id", project.id)
    .order("uploaded_at", { ascending: false });

  if (photosError) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        Chyba při načítání fotek: {photosError.message}
      </div>
    );
  }

  const signed = await Promise.all(
    (photos ?? []).map(async (p) => {
      const { data } = await supabase.storage.from("projects").createSignedUrl(p.storage_path, 15 * 60);
      return {
        id: p.id as string,
        originalFilename: (p.original_filename as string) || p.storage_path,
        url: data?.signedUrl ?? ""
      };
    })
  );

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
          <div className="p-4">
            {signed.length === 0 ? (
              <EmptyState icon={ImageIcon} title="Zatím žádné fotky" description="Jakmile budou nahrány, uvidíte je zde." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {signed.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-white/10 bg-charcoal/60 overflow-hidden">
                    {p.url ? (
                      <img src={p.url} alt={p.originalFilename} className="h-44 w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="h-44 w-full bg-white/[0.02]" />
                    )}
                    <div className="p-3">
                      <p className="text-xs text-offwhite/80 truncate" title={p.originalFilename}>
                        {p.originalFilename}
                      </p>
                      {p.url && (
                        <a
                          href={p.url}
                          className="mt-2 inline-flex text-xs text-champagne hover:text-amber"
                          download
                        >
                          Stáhnout
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

