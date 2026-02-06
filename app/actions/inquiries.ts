"use server";

import { headers } from "next/headers";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

const CATEGORY_LABELS: Record<string, string> = {
  interier: "Vizualizace interiéru",
  exterier: "Vizualizace exteriéru",
  pudorysy: "Půdorysy 2D/3D"
};

export type InquiryInput = {
  category?: string | null;
  idea?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
};

export async function submitInquiry(input: InquiryInput) {
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const phone = input.phone?.trim() ?? "";
  const idea = (input.idea?.trim() ?? "").length > 0 ? input.idea!.trim() : "—";

  if (!name || !email || !phone) {
    throw new Error("Chybí povinné údaje (jméno, e-mail, telefon).");
  }

  const categoryLabel = input.category ? CATEGORY_LABELS[input.category] ?? input.category : null;

  const h = headers();
  const userAgent = h.get("user-agent");
  const forwardedFor = h.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0]?.trim() : null;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("inquiries").insert({
    category: categoryLabel,
    idea,
    name,
    email,
    phone,
    project_type: null,
    message: input.message?.trim() || null,
    ip,
    user_agent: userAgent
  });

  if (error) throw error;
}

