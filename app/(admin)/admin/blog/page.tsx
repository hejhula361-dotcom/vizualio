import Link from "next/link";
import { FileText } from "lucide-react";

import { requireAdmin } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/app/admin/_components/PageHeader";
import { GlassCard, GlassCardHeader, GlassCardBody } from "@/app/admin/_components/GlassCard";
import { EmptyState } from "@/app/admin/_components/EmptyState";
import { Badge } from "@/app/admin/_components/Badge";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  await requireAdmin(["superadmin", "admin", "editor"]);

  const supabase = getSupabaseAdmin();
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, published, published_at, updated_at, created_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        Chyba při načítání článků: {error.message}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Správa článků"
        badge={
          <Link className="btn-secondary" href="/admin/blog/new">
            Nový článek
          </Link>
        }
      />

      <div className="mt-6">
        <GlassCard>
          <GlassCardHeader>Články</GlassCardHeader>
          <GlassCardBody>
            {(posts ?? []).length === 0 && (
              <EmptyState icon={FileText} title="Zatím žádné články" description="Vytvořte první článek." />
            )}

            {(posts ?? []).map((p: any) => (
              <Link
                key={p.id}
                href={`/admin/blog/${p.id}`}
                className="table-row flex items-start justify-between gap-6"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-offwhite">{p.title}</p>
                  <p className="text-xs text-stone truncate">{p.slug}</p>
                  {p.excerpt && <p className="mt-2 text-sm text-offwhite/80 line-clamp-2">{p.excerpt}</p>}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge variant={p.published ? "success" : "neutral"}>{p.published ? "published" : "draft"}</Badge>
                  <span className="text-xs text-stone">
                    {new Date((p.updated_at ?? p.created_at) as string).toLocaleDateString("cs-CZ")}
                  </span>
                </div>
              </Link>
            ))}
          </GlassCardBody>
        </GlassCard>
      </div>
    </div>
  );
}

