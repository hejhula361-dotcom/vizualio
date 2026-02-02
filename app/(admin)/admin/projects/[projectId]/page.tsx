import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageIcon, UploadCloud } from "lucide-react";

import { requireAdmin } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/app/admin/_components/PageHeader";
import { Badge } from "@/app/admin/_components/Badge";
import { GlassCard, GlassCardHeader } from "@/app/admin/_components/GlassCard";
import { EmptyState } from "@/app/admin/_components/EmptyState";
import { uploadProjectPhotos } from "@/app/(admin)/admin/projects/actions";

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

  const { data: photos, error: photosError } = await supabase
    .from("project_photos")
    .select("id, storage_path, original_filename, uploaded_at")
    .eq("project_id", projectId)
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
      const { data } = await supabase.storage.from("projects").createSignedUrl(p.storage_path, 60 * 60);
      return {
        id: p.id as string,
        originalFilename: (p.original_filename as string) || p.storage_path,
        url: data?.signedUrl ?? ""
      };
    })
  );

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

      <div className="content-card">
        <p className="text-sm text-stone uppercase tracking-[0.2em]">Nahrát fotky</p>
        <form action={uploadProjectPhotos} className="mt-4 space-y-3">
          <input type="hidden" name="projectId" value={projectId} />
          <input
            type="file"
            name="files"
            accept="image/*"
            multiple
            className="block w-full text-sm text-stone file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-offwhite hover:file:bg-white/15"
          />
          <button type="submit" className="btn-primary inline-flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            Nahrát
          </button>
          <p className="text-xs text-stone">
            Fotky se ukládají do privátního bucketu <span className="text-offwhite/80">projects</span> a klient je vidí
            přes signed URL.
          </p>
        </form>
      </div>

      <GlassCard>
        <GlassCardHeader icon={<ImageIcon className="h-4 w-4 text-champagne" />}>Fotky</GlassCardHeader>
        <div className="p-4">
          {signed.length === 0 ? (
            <EmptyState icon={ImageIcon} title="Zatím žádné fotky" description="Nahrajte první fotky výše." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {signed.map((p) => (
                <div key={p.id} className="rounded-2xl border border-white/10 bg-charcoal/60 overflow-hidden">
                  {p.url ? (
                    // signed URL -> raději <img> než next/image (bez remotePatterns pro /object/sign)
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
  );
}

