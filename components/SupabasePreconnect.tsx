"use client";

import { useEffect } from "react";

/**
 * Přidá preconnect a dns-prefetch pro Supabase CDN, aby se obrázky načítaly rychleji.
 */
export function SupabasePreconnect() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) return;
    const linkPreconnect = document.createElement("link");
    linkPreconnect.rel = "preconnect";
    linkPreconnect.href = url;
    document.head.appendChild(linkPreconnect);
    const linkDns = document.createElement("link");
    linkDns.rel = "dns-prefetch";
    linkDns.href = url;
    document.head.appendChild(linkDns);
    return () => {
      if (linkPreconnect.parentNode === document.head) document.head.removeChild(linkPreconnect);
      if (linkDns.parentNode === document.head) document.head.removeChild(linkDns);
    };
  }, []);
  return null;
}
