import type { MetadataRoute } from "next";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/seo";

function toAbsolute(path: string): string {
  return `${SITE_URL}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: toAbsolute("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: toAbsolute("/portfolio"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: toAbsolute("/cenik"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: toAbsolute("/blog"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    }
  ];

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, published_at, created_at")
    .eq("published", true);

  const blogEntries: MetadataRoute.Sitemap = (data ?? [])
    .filter((post: any) => Boolean(post.slug))
    .map((post: any) => ({
      url: toAbsolute(`/blog/${post.slug}`),
      lastModified: new Date(post.updated_at ?? post.published_at ?? post.created_at ?? Date.now()),
      changeFrequency: "monthly",
      priority: 0.7
    }));

  return [...staticPages, ...blogEntries];
}
