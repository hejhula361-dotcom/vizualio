"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { createProject } from "@/app/(admin)/admin/clients/actions";

export function CreateProjectForm({ clientId }: { clientId: string }) {
  const [projectName, setProjectName] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreatedProjectId(null);

    startTransition(async () => {
      try {
        const res = await createProject({ clientId, projectName });
        setCreatedProjectId(res.projectId);
        setProjectName("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepodařilo se vytvořit projekt.");
      }
    });
  };

  return (
    <div className="content-card">
      <h3 className="text-lg font-semibold text-offwhite">Nový projekt</h3>
      <p className="mt-1 text-sm text-stone">Vytvoří projekt pro tohoto klienta.</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label className="input-label">Název projektu</label>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="input-field"
            placeholder="např. Kuchyně - byt 2kk"
            required
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Vytvářím…" : "Vytvořit projekt"}
        </button>
      </form>

      {createdProjectId && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-offwhite/90">
          Projekt vytvořen:{" "}
          <Link className="text-champagne hover:text-amber" href={`/admin/projects/${createdProjectId}`}>
            otevřít detail
          </Link>
        </div>
      )}
    </div>
  );
}

