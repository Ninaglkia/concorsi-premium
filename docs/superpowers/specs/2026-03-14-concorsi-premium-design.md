# Concorsi Premium — Design Spec

## Overview

Piattaforma web di concorsi a premi con ticket numerati ed estrazione live in 3D. Gli utenti acquistano ticket per concorsi attivi; quando tutti i ticket di un concorso sono venduti, parte un'estrazione animata in tempo reale dove i numeri vengono estratti uno alla volta — l'ultimo numero rimasto è il vincitore.

Tutti i numeri dei ticket (da 1 a N) vengono inseriti in un array shufflato. I numeri vengono eliminati uno alla volta. L'ultimo numero nell'array (l'ultimo ad essere "estratto") è il vincitore.

**Modello economico:** Premio da €15.000 → 2.000 ticket × €10 = €20.000 → margine €5.000 (esempio).

## Stack Tecnico

| Layer | Tecnologia |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + Framer Motion |
| 3D | React Three Fiber + Three.js |
| Auth | Supabase Auth (email + Google, Apple, Facebook) |
| Database | Supabase PostgreSQL |
| Real-time | Supabase Realtime (WebSocket) |
| Pagamenti | Stripe Checkout |
| Deploy | Vercel (GitHub push-to-deploy) |
| Particelle | tsParticles |
| State Management | Zustand |
| Email | Resend (transactional emails) |
| Image Storage | Supabase Storage |
| Error Tracking | Sentry |

## Architettura

```
┌─────────────────────────────────────────────┐
│              Frontend (Next.js 15)           │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Pagine   │ │ Admin    │ │ 3D Engine    │ │
│  │ Pubbliche│ │ Dashboard│ │ (R3F/Three)  │ │
│  └────┬─────┘ └────┬─────┘ └──────┬───────┘ │
│       │             │              │         │
│  ┌────┴─────────────┴──────────────┴───────┐ │
│  │         API Routes (Next.js)            │ │
│  └────┬─────────────┬──────────────┬───────┘ │
└───────┼─────────────┼──────────────┼─────────┘
        │             │              │
   ┌────▼────┐  ┌─────▼─────┐ ┌─────▼─────┐
   │Supabase │  │  Stripe   │ │ Supabase  │
   │ DB+Auth │  │ Payments  │ │ Realtime  │
   └─────────┘  └───────────┘ └───────────┘
```

## Database Schema

### profiles (public table, synced from auth.users via trigger)
- `id` (uuid, PK, FK → auth.users.id)
- `email` (text)
- `name` (text, nullable)
- `avatar_url` (text, nullable)
- `role` (text, default 'user') — 'user' | 'admin'
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

Un trigger `on_auth_user_created` crea automaticamente un record in `profiles` quando un utente si registra via Supabase Auth.

### contests
- `id` (uuid, PK)
- `title` (text)
- `description` (text)
- `image_url` (text) — punta a Supabase Storage
- `prize_value` (integer) — valore del premio in centesimi
- `ticket_price` (integer) — prezzo ticket in centesimi
- `total_tickets` (integer) — es. 2000
- `tickets_sold` (integer, default 0) — counter denormalizzato, aggiornato atomicamente nella stessa transazione di INSERT ticket
- `prize_type` (text) — free-text category (es. "viaggio", "prodotto", "cash", "esperienza")
- `status` (enum: active, sold_out, extracting, completed)
- `winner_id` (uuid, FK → profiles, nullable)
- `winning_ticket_number` (integer, nullable)
- `created_at` (timestamptz)
- `completed_at` (timestamptz, nullable)

**Nota display:** `prize_value` e `ticket_price` sono in centesimi nel DB. Il frontend formatta in euro per la visualizzazione (es. 1500000 → €15.000).

### tickets
- `id` (uuid, PK)
- `contest_id` (uuid, FK → contests)
- `user_id` (uuid, FK → profiles)
- `ticket_number` (integer) — da 1 a total_tickets, assegnato automaticamente dal server
- `stripe_payment_intent_id` (text)
- `purchased_at` (timestamptz)
- UNIQUE constraint su (contest_id, ticket_number)

### extractions
- `id` (uuid, PK)
- `contest_id` (uuid, FK → contests, unique)
- `drawn_numbers` (integer[]) — ordine di estrazione, l'ultimo elemento è il vincitore
- `current_index` (integer, default 0) — posizione corrente nell'estrazione live
- `status` (enum: pending, live, completed)
- `started_at` (timestamptz, nullable)
- `completed_at` (timestamptz, nullable)

## Row-Level Security (RLS)

| Tabella | SELECT | INSERT | UPDATE | DELETE |
|---------|--------|--------|--------|--------|
| profiles | Utente vede solo il proprio profilo. Admin vede tutti. | Trigger automatico | Utente modifica solo il proprio. Admin tutti. | No |
| contests | Tutti (pubblico) | Solo admin | Solo admin | Solo admin |
| tickets | Utente vede solo i propri. Admin vede tutti. | Solo via API route (server-side) | No | No |
| extractions | Tutti (pubblico, per la live) | Solo server-side (service role) | Solo server-side (service role) | No |

Admin è identificato da `profiles.role = 'admin'`.

## API Routes

| Metodo | Route | Descrizione | Auth |
|--------|-------|-------------|------|
| POST | `/api/checkout` | Crea Stripe Checkout session per acquisto ticket | User |
| POST | `/api/webhooks/stripe` | Riceve webhook Stripe (con verifica firma) | Stripe signature |
| POST | `/api/extraction/start` | Avvia estrazione per un contest sold_out | Admin |
| POST | `/api/extraction/tick` | Avanza estrazione di N numeri (server-paced) | Admin/Cron |
| GET | `/api/extraction/[id]/state` | Stato corrente estrazione (per utenti che si connettono tardi) | Public |
| POST | `/api/admin/contests` | Crea nuovo concorso | Admin |
| PUT | `/api/admin/contests/[id]` | Modifica concorso | Admin |
| DELETE | `/api/admin/contests/[id]` | Elimina concorso (solo se nessun ticket venduto) | Admin |
| GET | `/api/user/tickets` | I miei ticket | User |

## Pagine e Navigazione

### Pubbliche
- `/` — Home: hero con particelle 3D, concorsi in evidenza, come funziona
- `/concorsi` — Bacheca: grid di contest cards con filtri (tutti, in vendita, estrazione imminente, completati)
- `/concorsi/[id]` — Dettaglio: immagine premio, info, ticket rimasti, barra progresso, acquisto ticket
- `/estrazione/[id]` — Estrazione live: scena 3D, numeri estratti, highlight ticket utente, reveal vincitore
- `/profilo` — I miei ticket, storico estrazioni, vittorie, impostazioni account
- `/auth/login` — Login/registrazione

### Admin (protette, solo role=admin)
- `/admin` — Dashboard: statistiche generali
- `/admin/concorsi` — Lista e gestione concorsi
- `/admin/concorsi/nuovo` — Creazione concorso
- `/admin/concorsi/[id]` — Dettaglio concorso, vendite, gestione
- `/admin/estrazioni/[id]` — Controllo estrazione, override manuale
- `/admin/utenti` — Gestione utenti

## Contest Card (Bacheca)

Ogni card nella bacheca mostra:
- Immagine del premio
- Titolo del concorso
- Valore del premio (es. €15.000)
- Prezzo ticket (es. €10)
- Ticket rimasti / totali (es. "753 rimasti su 2.000")
- Barra di progresso visuale con percentuale
- Pulsante "Acquista Ticket"
- Effetto glassmorphism, glow sui bordi al hover, tilt 3D al mouseover

## Estrazione Live 3D

### Meccanica
1. Ultimo ticket venduto → tutti gli utenti connessi vengono notificati
2. Scena 3D: urna/sfera trasparente con palline numerate che rimbalzano
3. Palline estratte una alla volta con animazione, numero grande a schermo

### Fasi di velocità (server-paced)
Il server controlla il ritmo dell'estrazione aggiornando `current_index` nella tabella `extractions`. Il frontend si abbona ai cambiamenti via Supabase Realtime e anima i numeri man mano che vengono rivelati. I numeri NON vengono inviati tutti insieme — questo impedisce a utenti tecnici di scoprire il vincitore in anticipo.

- Primi 80% → batch di 50 numeri ogni 2 secondi (server aggiorna current_index a blocchi)
- Ultimi 200 numeri → uno ogni 2-3 secondi
- Ultimi 50 → uno ogni 5 secondi, effetti glow e suspense
- Ultimi 10 → uno ogni 8-10 secondi, musica epica, particelle
- Ultimo numero = VINCITORE → esplosione particelle, confetti 3D, nome vincitore

### Connessione tardiva
Quando un utente si connette a estrazione in corso, il frontend chiama `GET /api/extraction/[id]/state` per recuperare `drawn_numbers[0..current_index]` (i numeri già estratti), poi si abbona al Realtime per i numeri successivi.

### Real-time
- Supabase Realtime sincronizza ogni aggiornamento di `current_index` a tutti gli utenti
- Ogni utente vede i propri ticket evidenziati
- Quando un proprio numero esce → flash rosso
- Counter live: "Rimangono X numeri"

### Fairness
- Seed random generato server-side al momento dell'estrazione usando `crypto.randomBytes`
- Ordine di estrazione pre-calcolato e salvato in `drawn_numbers`, immutabile
- Rivelato progressivamente al frontend tramite `current_index` (server-paced)
- L'array completo non è mai esposto al client prima del completamento

## Flusso Acquisto Ticket

1. Utente seleziona quantità ticket su `/concorsi/[id]` (numeri assegnati automaticamente, non scelti dall'utente)
2. Click "Acquista" → API route crea Stripe Checkout session
3. Pagamento completato → Stripe webhook ricevuto (con verifica firma `stripe.webhooks.constructEvent`)
4. Server in una **singola transazione PostgreSQL**:
   a. Acquisisce lock con `SELECT ... FOR UPDATE` sul contest
   b. Verifica ticket ancora disponibili
   c. Inserisce righe in `tickets` con numeri sequenziali
   d. Aggiorna `tickets_sold` atomicamente
   e. Se `tickets_sold === total_tickets` → status `sold_out`
5. Se `sold_out` → trigger automatico creazione record `extractions` con status `pending`
6. Utente riceve conferma con i numeri dei suoi ticket via email (Resend)

## Flusso Estrazione

1. Contest raggiunge `sold_out` → server crea record `extractions` con status `pending`
2. Admin avvia estrazione da dashboard (o trigger automatico) → API `/api/extraction/start`
3. Server genera array `drawn_numbers` (Fisher-Yates shuffle di 1..total_tickets) usando `crypto.randomBytes`
4. Status → `live`, broadcast via Supabase Realtime
5. Server avanza `current_index` progressivamente secondo le fasi di velocità
6. Ultimo numero → vincitore, status → `completed`, `winner_id` aggiornato sul contest
7. Winner notificato via email (Resend) con istruzioni per ricevere il premio
8. Premio consegnato entro 5 giorni lavorativi

## Email Triggers (via Resend)

| Evento | Destinatario | Contenuto |
|--------|-------------|-----------|
| Acquisto ticket | Acquirente | Conferma acquisto, numeri ticket, dettagli concorso |
| Estrazione in partenza | Tutti i partecipanti del concorso | "L'estrazione sta per iniziare, collegati!" |
| Vincitore | Vincitore | Congratulazioni, istruzioni ritiro premio |
| Estrazione completata | Tutti i partecipanti | Risultato, numero vincente |

## Design System

### Theme
- **Dark theme** primario
- Glassmorphism: sfondi con `backdrop-blur`, bordi semi-trasparenti
- Particelle animate sullo sfondo (tsParticles)
- Glow effects e gradients su elementi interattivi
- Font: **Space Grotesk** (primario, titoli e numeri), **Inter** (corpo testo)

### Colori
- Background: `#0a0a0f` → `#1a1a2e`
- Primary: gradient dorato `#f59e0b` → `#d97706` (premium feel)
- Accent: `#8b5cf6` (viola per CTAs secondarie)
- Success: `#10b981`
- Danger: `#ef4444`
- Glass: `rgba(255, 255, 255, 0.05)` con `backdrop-blur-xl`

### Responsive
- Mobile-first design con breakpoints standard Tailwind (sm, md, lg, xl)
- Navbar mobile: hamburger menu con slide-in
- Contest cards: 1 colonna mobile, 2 tablet, 3-4 desktop
- Estrazione 3D: scena semplificata su mobile (meno particelle, meno palline visibili) con fallback 2D per GPU deboli

### Stati UI
- **Empty:** "Nessun concorso disponibile al momento" con CTA per iscriversi alle notifiche
- **Loading:** Skeleton cards con effetto shimmer
- **Error:** Toast notification con retry action
- **3D fallback:** Se WebGL non supportato, animazione 2D CSS dell'estrazione

## Considerazioni Legali

I concorsi a premi in Italia sono regolamentati dal DPR 430/2001:
- Comunicazione preventiva al Ministero dello Sviluppo Economico
- Fideiussione bancaria/assicurativa a copertura del premio
- Server e dati su territorio italiano o UE
- Regolamento del concorso accessibile pubblicamente

Queste sono responsabilità del gestore (admin), non bloccano lo sviluppo tecnico ma devono essere gestite prima del lancio.

## Non in scope (v1)
- App mobile nativa
- Chat live durante estrazione
- Sistema referral/affiliazione
- Multi-lingua (solo italiano per v1)
- Crypto payments
- Scelta manuale dei numeri ticket (assegnazione automatica)
