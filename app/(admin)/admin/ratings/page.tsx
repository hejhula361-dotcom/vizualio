import { Star } from "lucide-react";

import { requireAdmin } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/app/admin/_components/PageHeader";
import { GlassCard, GlassCardHeader, GlassCardBody } from "@/app/admin/_components/GlassCard";
import { EmptyState } from "@/app/admin/_components/EmptyState";
import { Badge } from "@/app/admin/_components/Badge";

export const dynamic = "force-dynamic";

export default async function AdminRatingsPage() {
  await requireAdmin(["superadmin"]);

  const supabase = getSupabaseAdmin();
  const { data: ratings, error } = await supabase
    .from("project_ratings")
    .select(
      "id, stars, text, created_at, updated_at, project_id, client_id, projects ( project_name ), clients ( name, email )"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        Chyba při načítání hodnocení: {error.message}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Hodnocení"
        description="Přehled hodnocení od klientů (superadmin)"
        badge={<>{ratings?.length ?? 0} záznamů</>}
      />

      <div className="mt-6">
        <GlassCard>
          <GlassCardHeader icon={<Star className="h-4 w-4 text-champagne" />}>Hodnocení</GlassCardHeader>
          <GlassCardBody>
            {(ratings ?? []).length === 0 && (
              <EmptyState
                icon={Star}
                title="Zatím žádné hodnocení"
                description="Jakmile klienti ohodnotí projekty, uvidíte je zde."
              />
            )}

            {(ratings ?? []).map((r: any) => (
              <div key={r.id} className="table-row flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-offwhite">
                    {r.projects?.project_name ?? "Projekt"}
                  </p>
                  <p className="text-xs text-stone">
                    {r.clients?.name ?? "Klient"} {r.clients?.email ? `(${r.clients.email})` : ""}
                  </p>
                  {r.text && <p className="mt-2 text-sm text-offwhite/80 line-clamp-2">{r.text}</p>}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge variant="accent">{r.stars}/5</Badge>
                  <span className="text-xs text-stone">
                    {new Date(r.created_at as string).toLocaleString("cs-CZ")}
                  </span>
                </div>
              </div>
            ))}
          </GlassCardBody>
        </GlassCard>
      </div>
    </div>
  );
}

