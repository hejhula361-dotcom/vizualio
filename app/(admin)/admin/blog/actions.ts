"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";

const BLOG_BUCKET = "blog";

function getPublicUrl(bucket: string, path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const cleanBase = base.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  const encodedPath = cleanPath.split("/").map(encodeURIComponent).join("/");
  return `${cleanBase}/storage/v1/object/public/${bucket}/${encodedPath}`;
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  let slug = baseSlug;
  for (let i = 0; i < 20; i++) {
    const { data } = await supabase.from("blog_posts").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${baseSlug}-${i + 2}`;
  }
  return `${baseSlug}-${randomBytes(2).toString("hex")}`;
}

export async function uploadBlogImage(formData: FormData) {
  await requireAdmin(["superadmin", "admin", "editor"]);

  const file = formData.get("file") as File | null;
  if (!file) throw new Error("Chybí soubor.");
  if (!file.type.startsWith("image/")) throw new Error("Soubor musí být obrázek.");

  const supabase = getSupabaseAdmin();
  const nonce = randomBytes(4).toString("hex");
  const safeName = file.name.replace(/[^\w.\-()]+/g, "_");
  const path = `uploads/${Date.now()}-${nonce}-${safeName}`;

  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BLOG_BUCKET).upload(path, bytes, {
    contentType: file.type,
    upsert: false
  });
  if (error) throw error;

  return { path, publicUrl: getPublicUrl(BLOG_BUCKET, path) };
}

export async function createBlogPost(input: {
  title: string;
  excerpt?: string;
  content: any;
  coverImagePath?: string | null;
  published?: boolean;
}) {
  const session = await requireAdmin(["superadmin", "admin", "editor"]);
  const authorUserId = (session.user as any).id as string | undefined;

  const title = input.title.trim();
  if (!title) throw new Error("Titulek je povinný.");

  const slug = await ensureUniqueSlug(slugify(title));
  const now = new Date().toISOString();
  const published = Boolean(input.published);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title,
      slug,
      excerpt: input.excerpt?.trim() || null,
      content: input.content ?? null,
      cover_image_path: input.coverImagePath ?? null,
      published,
      published_at: published ? now : null,
      author_user_id: authorUserId ?? null
    })
    .select("id, slug")
    .single();

  if (error) throw error;

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { id: data.id as string, slug: data.slug as string };
}

export async function updateBlogPost(input: {
  id: string;
  title: string;
  excerpt?: string;
  content: any;
  coverImagePath?: string | null;
  published?: boolean;
}) {
  await requireAdmin(["superadmin", "admin", "editor"]);

  const id = input.id;
  const title = input.title.trim();
  if (!id) throw new Error("Missing id");
  if (!title) throw new Error("Titulek je povinný.");

  const supabase = getSupabaseAdmin();

  const { data: existing, error: existingError } = await supabase
    .from("blog_posts")
    .select("published")
    .eq("id", id)
    .single();
  if (existingError) throw existingError;

  const now = new Date().toISOString();
  const published = Boolean(input.published);
  const wasPublished = Boolean((existing as any).published);

  const updateData: Record<string, any> = {
    title,
    excerpt: input.excerpt?.trim() || null,
    content: input.content ?? null,
    cover_image_path: input.coverImagePath ?? null,
    published,
    updated_at: now
  };
  if (published && !wasPublished) updateData.published_at = now;
  if (!published) updateData.published_at = null;

  const { error } = await supabase.from("blog_posts").update(updateData).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
}

export async function deleteBlogPost(input: { id: string }) {
  await requireAdmin(["superadmin", "admin", "editor"]);
  const id = input.id;
  if (!id) throw new Error("Missing id");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

