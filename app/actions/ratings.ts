"use server";

import { revalidatePath } from "next/cache";

import { requireClient } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function upsertProjectRating(input: { projectId: string; stars: number; text?: string }) {
  const session = await requireClient();
  const clientId = (session.user as any).clientId as string | undefined;
  if (!clientId) throw new Error("Missing clientId in session");

  const projectId = input.projectId;
  const stars = Number(input.stars);
  const text = input.text?.trim() || null;

  if (!projectId) throw new Error("Missing projectId");
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) throw new Error("Hodnocení musí být 1–5 hvězdiček.");

  const supabase = getSupabaseAdmin();

  // ACL: klient může hodnotit jen své projekty
  const { error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("client_id", clientId)
    .single();
  if (projectError) throw new Error("Projekt neexistuje nebo k němu nemáte přístup.");

  const { error: upsertError } = await supabase
    .from("project_ratings")
    .upsert(
      {
        project_id: projectId,
        client_id: clientId,
        stars,
        text
      },
      { onConflict: "project_id" }
    );

  if (upsertError) throw upsertError;

  revalidatePath(`/account/projects/${projectId}`);
  revalidatePath("/admin/ratings");
}

