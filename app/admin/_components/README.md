# Admin design system

Komponenty a utility pro konzistentní vzhled adminu a klientského portálu.

## Komponenty

- **PageHeader** – nadpis stránky + popis + volitelný badge (počet záznamů).
- **GlassCard** / **GlassCardHeader** / **GlassCardBody** – skleněná karta pro tabulky a seznamy.
- **EmptyState** – prázdný stav s ikonou, titulkem a popisem.
- **Badge** – varianty: `neutral`, `accent`, `success`, `warning`, `error`.

## CSS třídy (globals.css)

| Účel | Třídy |
|------|--------|
| Stránka – nadpis | `page-header`, `page-header-title`, `page-header-desc`, `page-header-badge` |
| Karta | `glass-card`, `glass-card-header`, `glass-card-body` |
| Řádek tabulky | `table-row`, `table-row-expandable` |
| Badge | `badge`, `badge-neutral`, `badge-accent`, `badge-success`, `badge-warning`, `badge-error` |
| Prázdný stav | `empty-state`, `empty-state-icon`, `empty-state-title`, `empty-state-desc` |
| Formulář | `input-field`, `input-label` |
| Tlačítka | `btn-primary`, `btn-secondary` |
| Obsah (account/blog) | `content-card` |

## Barvy (Tailwind)

- **Pozadí:** `carbon`, `charcoal`, `obsidian`
- **Text:** `offwhite`, `stone`, `silver`
- **Akcent:** `champagne`, `amber`, `copper`
- **Stavy:** červená/amber/emerald přes `badge-*` nebo vlastní border/bg.

## Použití na nových stránkách

1. **Admin list (clients, projects, ratings, blog)**  
   `PageHeader` + `GlassCard` + `GlassCardHeader` + `GlassCardBody` + při prázdno `EmptyState`.

2. **Detail (client, project)**  
   `PageHeader` + `content-card` nebo `glass-card` pro bloky.

3. **Formuláře**  
   `input-label` + `input-field`, primární akce `btn-primary`, sekundární `btn-secondary`.

4. **Statusy (order_status, role)**  
   Komponenta `Badge` s variantou podle stavu (např. `success` pro delivered, `warning` pro in_progress).
