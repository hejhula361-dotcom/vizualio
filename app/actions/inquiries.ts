"use server";

import { headers } from "next/headers";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type InquiryInput = {
  idea: string;
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  message?: string;
};

export async function submitInquiry(input: InquiryInput) {
  const idea = input.idea?.trim() ?? "";
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";

  if (!idea || !name || !email) {
    throw new Error("Chybí povinné údaje (myšlenka, jméno, e-mail).");
  }

  const h = headers();
  const userAgent = h.get("user-agent");
  const forwardedFor = h.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0]?.trim() : null;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("inquiries").insert({
    idea,
    name,
    email,
    phone: input.phone?.trim() || null,
    project_type: input.projectType?.trim() || null,
    message: input.message?.trim() || null,
    ip,
    user_agent: userAgent
  });

  if (error) throw error;
}

