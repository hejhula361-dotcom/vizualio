"use client";

import { useMemo, useState, useTransition } from "react";

import { resetClientPassword } from "@/app/(admin)/admin/clients/actions";

type ResetResult = { username: string; tempPassword: string };

export function ClientCredentialsCard({ clientId, username }: { clientId: string; username: string | null }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResetResult | null>(null);

  const loginUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://vizualio.cz/login";
    return `${window.location.origin}/login`;
  }, []);

  const messageTemplate = useMemo(() => {
    if (!result) return "";
    return [
      "Dobrý den,",
      "",
      "posíláme nové přihlašovací údaje do klientského portálu Vizualio:",
      `Portál: ${loginUrl}`,
      `Uživatel: ${result.username}`,
      `Heslo: ${result.tempPassword}`,
      "",
      "Po přihlášení si prosím heslo změňte.",
      "",
      "Děkujeme,",
      "Vizualio"
    ].join("\n");
  }, [result, loginUrl]);

  return (
    <div className="content-card">
      <h3 className="text-lg font-semibold text-offwhite">Přístup do klientského portálu</h3>
      <p className="mt-1 text-sm text-stone">Heslo se zobrazuje pouze při vygenerování.</p>

      <div className="mt-4 space-y-2 text-sm text-offwhite/90">
        <div>
          <span className="text-stone">Portál:</span> {loginUrl}
        </div>
        <div>
          <span className="text-stone">Uživatel:</span> <span className="font-semibold">{username ?? "—"}</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          className="btn-primary"
          onClick={() => {
            setError(null);
            setResult(null);
            startTransition(async () => {
              try {
                const res = await resetClientPassword({ clientId });
                setResult(res);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Nepodařilo se vygenerovat heslo.");
              }
            });
          }}
        >
          {pending ? "Generuji…" : "Vygenerovat nové dočasné heslo"}
        </button>

        {result && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigator.clipboard.writeText(messageTemplate)}
          >
            Kopírovat šablonu zprávy
          </button>
        )}
      </div>

      {result && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-charcoal/60 p-5">
          <p className="text-sm text-stone uppercase tracking-[0.2em]">Nové údaje</p>
          <div className="mt-3 space-y-2 text-sm text-offwhite/90">
            <div>
              <span className="text-stone">Uživatel:</span> <span className="font-semibold">{result.username}</span>
            </div>
            <div>
              <span className="text-stone">Heslo:</span> <span className="font-semibold">{result.tempPassword}</span>
            </div>
          </div>

          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-obsidian/40 p-4 text-xs text-offwhite/80">
            {messageTemplate}
          </pre>
        </div>
      )}
    </div>
  );
}

