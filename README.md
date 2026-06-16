# Figura — Das digitale Systembrett

Figura bringt das klassische Systembrett in Online-Sitzungen für systemische Berater:innen, Coaches und Therapeut:innen. Echtzeit-Kollaboration, Session-Snapshots, DSGVO-konform.

## Tech-Stack

- Next.js 15 (App Router, TypeScript strict)
- Supabase (Auth, DB, Realtime) — Region Frankfurt
- Tailwind CSS v4 + shadcn/ui
- Vercel (Region Frankfurt)
- pnpm

## Setup

### 1. Repository klonen

```bash
git clone https://github.com/viastefan/figura.git
cd figura
pnpm install
```

### 2. Supabase-Projekt anlegen

1. Erstelle ein Projekt auf [supabase.com](https://supabase.com) in Region **Frankfurt (eu-central-1)**
2. Gehe zu Project Settings > API und kopiere die Keys

### 3. Umgebungsvariablen

Kopiere `.env.example` nach `.env.local` und fülle die Werte:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Datenbank-Migrationen

Die SQL-Migrationen in `supabase/migrations/` im Supabase SQL-Editor ausführen.

### 5. Starten

```bash
pnpm dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Projektstruktur

```
app/
  (marketing)/     Landing, Impressum, Datenschutz, AGB
  (auth)/          Login, Auth Callback
  (app)/           Dashboard, Session (geschützt)
  join/[token]/    Klient-Zugang (ohne Auth)
components/
  board/           Brett, Figuren, Drag-Logik
  ui/              shadcn-Komponenten
lib/
  supabase/        Client, Server, Middleware
types/             TypeScript-Typen
supabase/
  migrations/      SQL-Migrationen
```
