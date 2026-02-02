"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const PROJECTS_BUCKET = "projects";

function sanitizeFilename(name: string) {
  return name.replace(/[^\w.\-()]+/g, "_");
}

export async function uploadProjectPhotos(formData: FormData) {
  const session = await requireAdmin(["superadmin", "admin"]);

  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) throw new Error("Missing projectId");

  const files = formData.getAll("files").filter(Boolean) as File[];
  if (files.length === 0) throw new Error("Vyberte alespoň jeden soubor.");

  const supabase = getSupabaseAdmin();

  // Verify project exists
  const { error: projectError } = await supabase.from("projects").select("id").eq("id", projectId).single();
  if (projectError) throw projectError;

  const uploadedByUserId = (session.user as any).id as string | undefined;

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      continue; // ignore non-images for now
    }

    const originalFilename = file.name;
    const safeName = sanitizeFilename(originalFilename);
    const nonce = randomBytes(4).toString("hex");
    const storagePath = `${projectId}/${Date.now()}-${nonce}-${safeName}`;

    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage.from(PROJECTS_BUCKET).upload(storagePath, bytes, {
      contentType: file.type,
      upsert: false
    });
    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase.from("project_photos").insert({
      project_id: projectId,
      storage_path: storagePath,
      original_filename: originalFilename,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by_user_id: uploadedByUserId ?? null
    });
    if (insertError) throw insertError;
  }

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/account/projects/${projectId}`);
}

