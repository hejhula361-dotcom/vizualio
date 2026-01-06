# Vizualio

Luxusní dark-mode webová aplikace pro 3D vizualizace interiérů, exteriérů a nábytku.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**

## Lokální vývoj

```bash
# Instalace závislostí
npm install

# Spuštění dev serveru
npm run dev

# Build pro produkci
npm run build

# Spuštění produkční verze
npm start
```

Aplikace běží na [http://localhost:3000](http://localhost:3000)

## Deploy na Vercel

### 1. Push na GitHub

```bash
# Inicializace git (pokud ještě není)
git init

# Přidání všech souborů
git add .

# Commit
git commit -m "Initial commit"

# Přidání remote repository (nahraďte URL vaším GitHub repo)
git remote add origin https://github.com/VASE_USERNAME/vizualio-web.git

# Push na GitHub
git push -u origin main
```

### 2. Propojení s Vercel

1. Jděte na [vercel.com](https://vercel.com) a přihlaste se
2. Klikněte na **"Add New Project"**
3. Vyberte vaše GitHub repository
4. Vercel automaticky detekuje Next.js projekt
5. Klikněte na **"Deploy"**

Vercel automaticky:
- Detekuje Next.js framework
- Nastaví build command: `npm run build`
- Nastaví output directory: `.next`
- Nastaví install command: `npm install`

### 3. Environment Variables (pokud by byly potřeba)

Pokud budete potřebovat environment variables:
1. V projektu na Vercel jděte do **Settings** → **Environment Variables**
2. Přidejte potřebné proměnné

### 4. Custom Domain (volitelné)

1. V projektu na Vercel jděte do **Settings** → **Domains**
2. Přidejte svou doménu a následujte instrukce

## Struktura projektu

```
vizualio-web/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── context/        # React Context (LeadContext)
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Landing page
│   └── providers.tsx   # Context providers
├── components/
│   ├── Navbar.tsx      # Navigace
│   ├── Footer.tsx      # Footer
│   └── ContactForm.tsx # Kontaktní formulář
├── public/
│   └── img/            # Obrázky (logo, hero, portfolio)
└── ...
```

## Funkce

- ✅ Luxusní dark-mode design
- ✅ Responzivní layout
- ✅ Framer Motion animace
- ✅ Kontaktní formulář s multi-step flow
- ✅ Admin dashboard s přihlášením
- ✅ Správa poptávek (localStorage)
- ✅ Portfolio galerie
- ✅ FAQ sekce ve footeru

## Admin přístup

- URL: `/admin`
- Username: `admin`
- Password: `vizualio2025`

## Poznámky

- Data poptávek se ukládají do localStorage (pro produkci doporučujeme backend)
- Admin přihlášení je mock implementace (pro produkci doporučujeme proper auth)

