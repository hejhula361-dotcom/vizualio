"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";

import { upsertProjectRating } from "@/app/actions/ratings";

export function RatingForm({
  projectId,
  initialStars,
  initialText
}: {
  projectId: string;
  initialStars?: number | null;
  initialText?: string | null;
}) {
  const [stars, setStars] = useState<number>(initialStars ?? 5);
  const [text, setText] = useState<string>(initialText ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await upsertProjectRating({ projectId, stars, text });
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepodařilo se uložit hodnocení.");
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <p className="text-sm text-stone uppercase tracking-[0.2em]">Hodnocení</p>
        <div className="mt-3 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            const active = value <= stars;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setStars(value)}
                className="p-1"
                aria-label={`${value} hvězdiček`}
              >
                <Star className={`h-6 w-6 ${active ? "text-champagne" : "text-stone/40"}`} />
              </button>
            );
          })}
          <span className="ml-2 text-sm text-stone">{stars}/5</span>
        </div>
      </div>

      <div>
        <label className="input-label">Zpětná vazba (volitelné)</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="input-field"
          placeholder="Co se vám líbilo / co zlepšit…"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Uloženo. Děkujeme!
        </div>
      )}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Ukládám…" : "Uložit hodnocení"}
      </button>
    </form>
  );
}

