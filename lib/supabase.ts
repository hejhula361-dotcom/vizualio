import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Klient se vytvoří jen když jsou nastavené env (jinak by createClient házel při buildi). */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

/** Bucket pro obrázky portfolia v Supabase Storage */
export const PORTFOLIO_BUCKET = "portfolio-images";

/**
 * Vrátí veřejnou URL obrázku z Supabase Storage (bucket pro portfolio).
 * Když není nastaven SUPABASE_URL, vrací lokální cestu /img/... (fallback pro dev/build).
 * @param path - cesta v bucketu, např. "viz1.png" nebo "MMDum (1).jpeg"
 * @param options - volitelně width/height pro zmenšený náhled (vyžaduje Supabase Pro – Image Transformations)
 */
export function getPortfolioImageUrl(
  path: string,
  options?: { width?: number; height?: number; quality?: number }
): string {
  if (!supabaseUrl) return `/img/${path}`;
  const cleanPath = path.replace(/^\//, "");
  const encodedPath = cleanPath.split("/").map(encodeURIComponent).join("/");
  const base = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${PORTFOLIO_BUCKET}/${encodedPath}`;
  if (options?.width ?? options?.height) {
    const params = new URLSearchParams();
    if (options.width) params.set("width", String(options.width));
    if (options.height) params.set("height", String(options.height));
    if (options.quality) params.set("quality", String(options.quality));
    return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/render/image/public/${PORTFOLIO_BUCKET}/${encodedPath}?${params.toString()}`;
  }
  return base;
}
