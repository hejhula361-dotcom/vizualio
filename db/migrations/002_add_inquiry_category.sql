-- Add category to inquiries (from first step: Vizualizace interiéru / exteriéru / Půdorysy)
alter table public.inquiries
  add column if not exists category text;

comment on column public.inquiries.category is 'Kategorie z prvního kroku formuláře: Vizualizace interiéru, Vizualizace exteriéru, Půdorysy 2D/3D';
