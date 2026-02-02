import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Článek nenalezen | Vizualio" };
  return {
    title: `${post.title} | Vizualio`,
    description: post.excerpt ?? undefined
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

  return (
    <div className="section-container">
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
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        )}

        <div className="mt-10 blog-content" dangerouslySetInnerHTML={{ __html: html || "" }} />
      </article>
    </div>
  );
}

