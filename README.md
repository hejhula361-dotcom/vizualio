# Vizualio

Next.js 14 web + administrace + klientský portál, data v Supabase (Postgres + Storage).

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Framer Motion + Lucide
- Supabase (Postgres + Storage)
- NextAuth (admin přes GitHub allowlist, klient přes username+heslo)
- TipTap (admin editor blogu)

## Lokální vývoj

1) Instalace:

```bash
npm install
```

2) Env:

- Zkopíruj `.env.example` → `.env.local` a doplň skutečné hodnoty.

3) Supabase:

- Spusť migraci `db/migrations/001_init.sql` v Supabase SQL editoru.
- Vytvoř Storage buckety:
  - `portfolio-images` (public) – marketingové portfolio
  - `projects` (private) – doručení fotek klientům (signed URL)
  - `blog` (public) – obrázky do článků

4) Spuštění:

```bash
npm run dev
```

Aplikace běží na `http://localhost:3000`.

## Environment variables

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase URL (pro klienta i server)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – public anon key (používá se např. pro URL obrázků)
- `SUPABASE_SERVICE_ROLE_KEY` – **server-only** (DB + privátní Storage operace)

### NextAuth

- `NEXTAUTH_URL` – např. `http://localhost:3000` (na Vercelu URL projektu)
- `NEXTAUTH_SECRET` – náhodný secret pro JWT/cookies

### Admin login (GitHub)

- `GITHUB_ID`
- `GITHUB_SECRET`
- `ADMIN_EMAIL_ALLOWLIST` – comma-separated seznam e-mailů, které se mohou přihlásit do `/admin`

## Přístupy

### Admin

- Login: `/admin/login` (GitHub OAuth)
- Poptávky: `/admin/inquiries`
- Klienti/projekty: `/admin/clients`, `/admin/projects/[projectId]`
- Uživatelé (role): `/admin/users` (jen `superadmin`)
- Hodnocení: `/admin/ratings` (jen `superadmin`)
- Blog: `/admin/blog`

### Klient

- Login: `/login` (username + dočasné heslo)
- Projekty: `/account`
- Detail projektu: `/account/projects/[projectId]`

## Poznámky k bezpečnosti

- `SUPABASE_SERVICE_ROLE_KEY` nikdy nedávat do klienta / veřejných env.
- Všechny citlivé operace (CRUD, uploady, signed URL) běží server-side.
- `projects` bucket je privátní – pro zobrazení/stažení se generují signed URL.

## Deploy (Vercel)

1) Přidej env proměnné do Vercelu (Project → Settings → Environment Variables).
2) Nasazení probíhá standardně přes `npm run build`.
3) Nezapomeň, že Supabase migrace + buckety se nastavují v Supabase (mimo Vercel).

