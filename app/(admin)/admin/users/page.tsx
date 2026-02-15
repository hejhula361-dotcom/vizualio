import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/app/admin/_components/PageHeader";
import { GlassCard, GlassCardBody } from "@/app/admin/_components/GlassCard";
import { EmptyState } from "@/app/admin/_components/EmptyState";
import { Users } from "lucide-react";

type UserRole = "superadmin" | "admin" | "editor";

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "superadmin", label: "superadmin" },
  { value: "admin", label: "admin" },
  { value: "editor", label: "editor" }
];

async function updateUserRole(formData: FormData) {
  "use server";

  await requireAdmin(["superadmin"]);

  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "") as UserRole;

  if (!userId) throw new Error("Missing userId");
  if (!roleOptions.some((r) => r.value === role)) throw new Error("Invalid role");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("users").update({ role }).eq("id", userId);
  if (error) throw error;

  revalidatePath("/admin/users");
}

export default async function AdminUsersPage() {
  await requireAdmin(["superadmin"]);

  const supabase = getSupabaseAdmin();
  const { data: users, error } = await supabase
    .from("users")
    .select("id, email, name, role, created_at, last_login_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        Chyba při načítání uživatelů: {error.message}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Uživatelé"
        description="Správa rolí (pouze superadmin)"
        badge={<>{users?.length ?? 0} účtů</>}
      />

      <div className="mt-6">
        <GlassCard>
          <div className="grid w-full min-w-0 grid-cols-[1fr,180px,200px,120px] gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-stone">
            <span>Uživatel</span>
            <span>Role</span>
            <span>Poslední přihlášení</span>
            <span className="text-right">Akce</span>
          </div>
          <GlassCardBody>
            {(users ?? []).map((u) => (
              <div
                key={u.id}
                className="grid w-full min-w-0 grid-cols-[1fr,180px,200px,120px] gap-3 items-center px-4 py-3 transition hover:bg-white/[0.02]"
              >
                <form action={updateUserRole} className="contents">
                  <div>
                    <p className="text-sm font-semibold text-offwhite">{u.name || "—"}</p>
                    <p className="text-xs text-stone">{u.email}</p>
                    <p className="mt-1 text-xs text-stone/80">
                      Vytvořeno: {new Date(u.created_at as string).toLocaleDateString("cs-CZ")}
                    </p>
                  </div>

                  <div>
                    <input type="hidden" name="userId" value={u.id} />
                    <select
                      name="role"
                      defaultValue={(u.role ?? "admin") as string}
                      className="w-full rounded-xl border border-white/10 bg-obsidian/60 px-3 py-2 text-sm text-offwhite focus:border-champagne/60 focus:outline-none"
                    >
                      {roleOptions.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-stone">
                    {u.last_login_at ? new Date(u.last_login_at as string).toLocaleString("cs-CZ") : "—"}
                  </p>

                  <div className="text-right">
                    <button
                      type="submit"
                      className="rounded-full bg-champagne px-3 py-2 text-xs font-semibold text-carbon shadow-glow transition hover:bg-amber"
                    >
                      Uložit
                    </button>
                  </div>
                </form>
              </div>
            ))}

            {(users ?? []).length === 0 && (
              <EmptyState icon={Users} title="Zatím žádní admin uživatelé" description="Přihlaste se přes GitHub allowlist." />
            )}
          </GlassCardBody>
        </GlassCard>
      </div>
    </div>
  );
}

