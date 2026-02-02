import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Blog | Vizualio",
  description: "Novinky a články o 3D vizualizacích, interiérech a prezentaci projektů."
};

export const dynamic = "force-dynamic";

function coverUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const cleanBase = base.replace(/\/$/, "");
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${cleanBase}/storage/v1/object/public/blog/${encoded}`;
}

export default async function BlogIndexPage() {
  const supabase = getSupabaseAdmin();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image_path, published_at, created_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="section-container">
      <div className="text-center">
        <h1 className="section-title">Blog</h1>
        <p className="section-subtitle max-w-2xl mx-auto">Tipy, ukázky a novinky ze světa 3D vizualizací.</p>
        <div className="w-20 h-0.5 bg-champagne/60 mx-auto mt-8" />
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {(posts ?? []).map((p: any) => (
          <Link
            key={p.id}
            href={`/blog/${p.slug}`}
            className="group rounded-2xl border border-white/10 bg-charcoal/60 overflow-hidden hover:border-champagne/40 transition"
          >
            {p.cover_image_path ? (
              <div className="relative h-56 w-full">
                <Image
                  src={coverUrl(p.cover_image_path as string)}
                  alt={p.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="h-56 w-full bg-white/[0.02]" />
            )}
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-stone">
                {new Date((p.published_at ?? p.created_at) as string).toLocaleDateString("cs-CZ")}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-offwhite">{p.title}</h2>
              {p.excerpt && <p className="mt-3 text-sm text-stone line-clamp-3">{p.excerpt}</p>}
              <p className="mt-4 text-sm text-champagne group-hover:text-amber transition">Číst dál →</p>
            </div>
          </Link>
        ))}
      </div>

      {(posts ?? []).length === 0 && (
        <div className="mt-12 content-card text-center">
          <p className="text-offwhite font-medium">Zatím žádné články.</p>
          <p className="mt-2 text-sm text-stone">Brzy doplníme první příspěvky.</p>
        </div>
      )}
    </div>
  );
}

