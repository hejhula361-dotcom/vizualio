import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

function coverUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const cleanBase = base.replace(/\/$/, "");
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${cleanBase}/storage/v1/object/public/blog/${encoded}`;
}

async function getPost(slug: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, content, cover_image_path, published_at, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (error || !data) return null;
  return data as any;
}

function extractTextFromContent(content: unknown): string {
  if (!content) return "";
  try {
    const serialized = JSON.stringify(content);
    return serialized.replace(/[\[\]{}"]/g, " ").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}

function buildSeoDescription(post: any): string {
  const excerpt = typeof post?.excerpt === "string" ? post.excerpt.trim() : "";
  if (excerpt.length > 0) return excerpt.slice(0, 160);

  const contentText = extractTextFromContent(post?.content);
  if (contentText.length > 0) return contentText.slice(0, 160);

  return "Článek o 3D vizualizacích, stavbě domu a rekonstrukcích od Vizualio.";
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Článek nenalezen | Vizualio" };
  return {
    title: `${post.title} | Vizualio`,
    description: buildSeoDescription(post),
    alternates: {
      canonical: `/blog/${params.slug}`
    },
    openGraph: {
      title: `${post.title} | Vizualio`,
      description: buildSeoDescription(post),
      url: absoluteUrl(`/blog/${params.slug}`),
      type: "article"
    },
    twitter: {
      title: `${post.title} | Vizualio`,
      description: buildSeoDescription(post)
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const html =
    post.content &&
    generateHTML(post.content, [
      StarterKit,
      LinkExt.configure({ openOnClick: true }),
      ImageExt.configure({ inline: false })
    ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: buildSeoDescription(post),
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.published_at ?? post.created_at,
    author: {
      "@type": "Organization",
      name: SITE_NAME
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME
    },
    mainEntityOfPage: absoluteUrl(`/blog/${params.slug}`)
  };

  return (
    <div className="section-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-stone">
          {new Date((post.published_at ?? post.created_at) as string).toLocaleDateString("cs-CZ")}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-offwhite">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg text-stone">{post.excerpt}</p>}

        {post.cover_image_path && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={coverUrl(post.cover_image_path as string)}
              alt={`Hlavní 3D vizualizace v článku: ${post.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        )}

        <div className="mt-10 blog-content" dangerouslySetInnerHTML={{ __html: html || "" }} />

        <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-6">
          <Link
            href="/"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-offwhite transition hover:border-champagne hover:text-champagne"
          >
            Homepage
          </Link>
          <Link
            href="/portfolio"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-offwhite transition hover:border-champagne hover:text-champagne"
          >
            Portfolio
          </Link>
          <Link
            href="/cenik"
            className="rounded-full bg-champagne px-4 py-2 text-sm font-medium text-carbon transition hover:bg-amber"
          >
            Ceník
          </Link>
        </div>
      </article>
    </div>
  );
}

