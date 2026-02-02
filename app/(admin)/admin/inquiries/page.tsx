import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth-server";

import { InquiriesClient, type InquiryRow } from "@/app/(admin)/admin/inquiries/_components/InquiriesClient";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  await requireAdmin();

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("inquiries")
    .select("id, created_at, name, email, phone, project_type, idea, message")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        Chyba při načítání poptávek: {error.message}
      </div>
    );
  }

  return <InquiriesClient inquiries={(data ?? []) as unknown as InquiryRow[]} />;
}

