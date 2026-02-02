import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/app/admin/_components/PageHeader";
import { Badge } from "@/app/admin/_components/Badge";
import { BlogEditor } from "@/app/(admin)/admin/blog/_components/BlogEditor";

export const dynamic = "force-dynamic";

export default async function AdminBlogEditPage({ params }: { params: { id: string } }) {
  await requireAdmin(["superadmin", "admin", "editor"]);

  const supabase = getSupabaseAdmin();
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, cover_image_path, published")
    .eq("id", params.id)
    .single();

  if (error || !post) notFound();

  return (
    <div>
      <PageHeader
        title={post.title}
        description={post.slug}
        badge={<Badge variant={post.published ? "success" : "neutral"}>{post.published ? "published" : "draft"}</Badge>}
      />
      <div className="mt-6">
        <BlogEditor
          mode="edit"
          postId={post.id as string}
          initial={{
            title: (post.title as string) ?? "",
            excerpt: (post.excerpt as string) ?? "",
            content: (post.content as any) ?? null,
            coverImagePath: (post.cover_image_path as string) ?? null,
            published: Boolean(post.published)
          }}
        />
      </div>
    </div>
  );
}

