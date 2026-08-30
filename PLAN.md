# PLAN.md — Build Plan

Tech stack: **Laravel** (backend) + **Laravel Inertia + React** (frontend) +
**MySQL** (database), built in **Antigravity IDE** with AI-agent assistance.

Check items off (`[x]`) as they're completed — the agent should keep this file
current; see `AGENT.md` §3, step 7.

## Phase 0 — Project Setup

- [x] Scaffolding Laravel 11 project structure
- [x] Install Laravel Breeze with the Inertia + React stack
      (`laravel/breeze` → `php artisan breeze:install react`)
- [x] Configure MySQL connection in `.env`
- [x] Install Tailwind (ships with Breeze's React stack) and confirm the
      design tokens from `DESIGN.md` §2 are added to `tailwind.config.js`
- [x] Set up ESLint + Prettier (frontend), Laravel Pint (backend)
- [x] Lucide React icons integrated

## Phase 1 — Database & Models

- [x] Build every migration in `DATABASE_DESIGN.md`
- [x] Models + relationships + `$fillable` + casts
- [x] Factories + seeders (demo categories, items, portfolio pieces, clients)
- [x] `php artisan migrate:fresh --seed` runs clean

## Phase 2 — Public Site Shell

- [x] `PublicLayout` with `Header` (mega-menu, search, client icon, Free
      Quote CTA) and `Footer` — per `DESIGN.md` §1
- [x] Responsive nav collapse (mobile hamburger) — `DESIGN.md` §9

## Phase 3 — Home Page

- [x] `HeroBanner` (video/image + CTA)
- [x] `FeaturedStrip` ("swap latest products")
- [x] Category quick-link cards (Apps / Website / Software)

## Phase 4 — Services Browsing

- [x] `/services` — three-column category overview (`DESIGN.md` §4)
- [x] `/services/{category}` — item grid per category (`DESIGN.md` §5)
- [x] `/services/{category}/{item}` — item detail page with gallery,
      description, price, Buy button, Request Quote button, related
      portfolio pieces

## Phase 5 — Portfolio

- [x] `/portfolio` — carousel + filterable grid (Website / Software / POS
      Software) — `DESIGN.md` §6
- [x] `/portfolio/{slug}` — detail page (gallery, client, description, link
      back to related item)

## Phase 6 — Clients Page

- [x] `/clients` — client list (`DESIGN.md` §7)
- [x] Admin CRUD for clients (logo upload, name, testimonial, sort order)

## Phase 7 — Quotes

- [x] `QuoteForm` component, reusable on item detail + a standalone
      `/get-a-quote` page
- [x] `POST /quotes` — validated, rate-limited, stores in DB
- [x] Admin: view/manage quote requests, mark status (new / contacted / won / lost)

## Phase 8 — Purchases / Client Accounts

- [x] Auth (register/login/logout) via Breeze scaffolding
- [x] Client dashboard: order history, profile
- [x] Purchase flow on item detail: create `order`, server-recomputed price (`GOOD_PRACTICES.md` §5)
- [x] Order checkout page + dashboard order tracker

## Phase 9 — Admin Panel

- [x] Admin auth + role middleware
- [x] CRUD: Categories, Items, Portfolio pieces, Clients, Quotes, Orders (read + status update)
- [x] Dashboard summary (recent quotes, recent orders, metrics)

## Phase 10 — Search

- [x] Header search bar: typeahead against `items` + `portfolios` (name/title)
- [x] `/search?q=...` results page

## Phase 11 — Polish & QA

- [x] Visual QA every page against `DESIGN.md` on desktop + mobile widths
- [x] Run through `GOOD_PRACTICES.md` §5 security checklist in full
- [x] `php artisan test` green (36/36 tests passing)
