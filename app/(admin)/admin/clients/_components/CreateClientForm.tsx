"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";

import { createClientWithCredentials } from "@/app/(admin)/admin/clients/actions";

type CreatedCredentials = {
  clientId: string;
  username: string;
  tempPassword: string;
};

export function CreateClientForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedCredentials | null>(null);

  const loginUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://vizualio.cz/login";
    return `${window.location.origin}/login`;
  }, []);

  const messageTemplate = useMemo(() => {
    if (!created) return "";
    return [
      "Dobrý den,",
      "",
      "tady jsou přihlašovací údaje do klientského portálu Vizualio:",
      `Portál: ${loginUrl}`,
      `Uživatel: ${created.username}`,
      `Heslo: ${created.tempPassword}`,
      "",
      "Po přihlášení si prosím heslo změňte.",
      "",
      "Děkujeme,",
      "Vizualio"
    ].join("\n");
  }, [created, loginUrl]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreated(null);

    startTransition(async () => {
      try {
        const res = await createClientWithCredentials({ name, email: email || undefined });
        setCreated(res);
        setName("");
        setEmail("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepodařilo se vytvořit klienta.");
      }
    });
  };

  return (
    <div className="content-card">
      <h3 className="text-lg font-semibold text-offwhite">Nový klient</h3>
      <p className="mt-1 text-sm text-stone">Vytvoří klienta + přihlašovací údaje (dočasné heslo).</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="input-label">Jméno</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Jana Nováková"
              required
            />
          </div>
          <div>
            <label className="input-label">E-mail (volitelné)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="jana@firma.cz"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Vytvářím…" : "Vytvořit klienta"}
        </button>
      </form>

      {created && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-charcoal/60 p-5">
          <p className="text-sm text-stone uppercase tracking-[0.2em]">Přihlašovací údaje</p>
          <div className="mt-3 space-y-2 text-sm text-offwhite/90">
            <div>
              <span className="text-stone">Portál:</span> {loginUrl}
            </div>
            <div>
              <span className="text-stone">Uživatel:</span> <span className="font-semibold">{created.username}</span>
            </div>
            <div>
              <span className="text-stone">Heslo:</span> <span className="font-semibold">{created.tempPassword}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigator.clipboard.writeText(messageTemplate)}
            >
              Kopírovat šablonu zprávy
            </button>
            <Link className="btn-secondary" href={`/admin/clients/${created.clientId}`}>
              Otevřít detail klienta
            </Link>
          </div>

          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-obsidian/40 p-4 text-xs text-offwhite/80">
            {messageTemplate}
          </pre>
        </div>
      )}
    </div>
  );
}

