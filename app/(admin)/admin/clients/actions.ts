"use server";

import { randomBytes } from "crypto";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function generateUsername() {
  return `client-${randomBytes(4).toString("hex")}`;
}

function generateTempPassword() {
  // 12 chars base64url-ish
  return randomBytes(9).toString("base64url");
}

export async function createClientWithCredentials(input: { name: string; email?: string }) {
  await requireAdmin(["superadmin", "admin"]);

  const name = input.name.trim();
  const email = input.email?.trim() || null;
  if (!name) throw new Error("Jméno klienta je povinné.");

  const supabase = getSupabaseAdmin();

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .insert({ name, email, status: "active" })
    .select("id")
    .single();
  if (clientError) throw clientError;

  const tempPassword = generateTempPassword();
  const passwordHash = await hash(tempPassword, 10);

  // Username collisions are extremely unlikely, but we still try a few times.
  let username = generateUsername();
  for (let i = 0; i < 5; i++) {
    const { error: authError } = await supabase.from("client_auth").insert({
      client_id: client.id,
      username,
      password_hash: passwordHash,
      must_change_password: true
    });
    if (!authError) break;
    username = generateUsername();
    if (i === 4) throw authError;
  }

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${client.id}`);

  return { clientId: client.id as string, username, tempPassword };
}

export async function resetClientPassword(input: { clientId: string }) {
  await requireAdmin(["superadmin", "admin"]);

  const clientId = input.clientId;
  if (!clientId) throw new Error("Missing clientId");

  const supabase = getSupabaseAdmin();
  const tempPassword = generateTempPassword();
  const passwordHash = await hash(tempPassword, 10);

  const { data: authRow, error: authFetchError } = await supabase
    .from("client_auth")
    .select("id, username")
    .eq("client_id", clientId)
    .maybeSingle();
  if (authFetchError) throw authFetchError;

  if (!authRow) {
    const username = generateUsername();
    const { error: insertError } = await supabase.from("client_auth").insert({
      client_id: clientId,
      username,
      password_hash: passwordHash,
      must_change_password: true
    });
    if (insertError) throw insertError;
    revalidatePath(`/admin/clients/${clientId}`);
    return { username, tempPassword };
  }

  const { error: updateError } = await supabase
    .from("client_auth")
    .update({ password_hash: passwordHash, must_change_password: true })
    .eq("id", authRow.id);
  if (updateError) throw updateError;

  revalidatePath(`/admin/clients/${clientId}`);
  return { username: authRow.username as string, tempPassword };
}

export async function createProject(input: { clientId: string; projectName: string }) {
  await requireAdmin(["superadmin", "admin"]);

  const clientId = input.clientId;
  const projectName = input.projectName.trim();
  if (!clientId) throw new Error("Missing clientId");
  if (!projectName) throw new Error("Název projektu je povinný.");

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("projects")
    .insert({ client_id: clientId, project_name: projectName, order_status: "new" })
    .select("id")
    .single();
  if (error) throw error;

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath(`/admin/projects/${data.id}`);
  return { projectId: data.id as string };
}

