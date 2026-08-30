# AGENT.md — AI Agent Operating Guide

This file tells the AI agent (running inside Antigravity IDE) how to work on this
codebase. Read this file first, every session, before touching any code.

## 1. Project Summary

A **portfolio + service-purchase website** for a software house. Visitors browse
work organized into three categories — **Apps**, **Websites**, **Software** —
view detailed portfolio pieces, request a **Free Quote**, and can **purchase**
selected service items directly. There is a client-facing area (login, order
history) and an admin area (manage services, portfolio, quotes, clients).

- **Backend:** Laravel (PHP)
- **Frontend:** Laravel Inertia.js + React
- **Database:** MySQL
- **IDE / workflow:** Antigravity IDE with an AI coding agent (this agent)

Read `DESIGN.md`, `PLAN.md`, `DATABASE_DESIGN.md`, and `GOOD_PRACTICES.md`
alongside this file — they are not optional context, they are the spec.

## 2. Ground Rules for the Agent

1. **Never invent scope.** Build only what `PLAN.md` describes for the current
   phase. If something is ambiguous, leave a `// TODO(agent): confirm with user`
   comment instead of guessing silently.
2. **Follow the schema in `DATABASE_DESIGN.md` exactly.** If a change is needed,
   update `DATABASE_DESIGN.md` in the same commit as the migration.
3. **Follow `DESIGN.md` for every UI screen.** Don't freestyle colors, spacing,
   or component structure — match the design tokens and layout patterns defined
   there, which are pulled directly from the approved wireframe.
4. **One feature = one branch = one focused commit set.** Never bundle unrelated
   changes (e.g. don't fix styling while adding the quote-request migration).
5. **Every migration must have a matching model, factory, and seeder.** Every
   controller action that returns data to Inertia must have a corresponding
   TypeScript/prop type on the frontend page.
6. **Never commit secrets.** `.env`, API keys, and DB credentials stay out of
   version control — verify `.gitignore` covers them before the first commit.
7. **Re-read the relevant section of `GOOD_PRACTICES.md` before writing code
   in an area you haven't touched yet this session** (auth, payments, file
   uploads, etc.) — those sections carry security-specific rules.
8. **After generating code, run it.** Don't hand back code that hasn't been
   checked against `php artisan serve` / `npm run dev` at least once, and
   don't claim a migration works without running `php artisan migrate:fresh`
   locally.

## 3. Standard Workflow (per task)

1. **Restate the task** in one or two sentences before writing code, referencing
   the relevant section of `PLAN.md`.
2. **Check the database design** — does this task need a new table/column?
   Update `DATABASE_DESIGN.md` first, then generate the migration.
3. **Backend first:** migration → model (with relationships, `$fillable`,
   casts) → policy/authorization if needed → controller → form request
   (validation) → route.
4. **Frontend second:** Inertia page component under `resources/js/Pages/...`,
   using shared layout components from `resources/js/Layouts`. Reuse existing
   components before creating new ones — check `resources/js/Components` first.
5. **Wire it up:** confirm the controller passes exactly the props the page
   expects (`Inertia::render('Path', [...])`), and that empty/loading/error
   states are handled on the frontend.
6. **Self-review checklist** (see §4) before marking the task done.
7. **Update `PLAN.md`** — tick off the completed item.

## 4. Self-Review Checklist (run before finishing any task)

- [ ] Migration matches `DATABASE_DESIGN.md`
- [ ] Form Requests validate every field (no raw `$request->all()` mass
      assignment without `$fillable` guarding it)
- [ ] Authorization checked (Policy or middleware) for any admin/client-only
      action
- [ ] No N+1 queries introduced (`->with()` used for relationships rendered
      in lists)
- [ ] Frontend matches the layout/spacing/colors in `DESIGN.md`
- [ ] Page is responsive (mobile header collapses per `DESIGN.md` §5)
- [ ] Images use lazy loading and a placeholder/fallback
- [ ] No console errors/warnings in the browser
- [ ] Naming matches conventions in `GOOD_PRACTICES.md` §1

## 5. File / Folder Map the Agent Should Respect

```
app/
  Http/
    Controllers/
      Admin/            -> admin CRUD controllers (services, portfolio, clients, quotes)
      Public/            -> storefront controllers (home, category, item, portfolio, quote)
      Auth/              -> Breeze/Fortify-style auth controllers
    Requests/            -> one FormRequest per write action
    Middleware/
  Models/
  Policies/
  Services/              -> non-trivial business logic (quote pricing, order totals)
database/
  migrations/
  seeders/
  factories/
resources/
  js/
    Pages/
      Public/            -> Home, Category, Item, Portfolio, PortfolioDetail, Quote, Clients
      Admin/
      Auth/
    Layouts/             -> PublicLayout (header/footer per DESIGN.md), AdminLayout
    Components/          -> Header, SearchBar, CategoryCard, PortfolioCard, ClientCard, Footer, QuoteForm
routes/
  web.php                -> public + client routes
  admin.php              -> admin routes (prefix /admin)
```

## 6. Definition of Done

A task is only done when:
- Backend and frontend are both implemented and connected
- The self-review checklist (§4) passes
- `PLAN.md` is updated
- Nothing in `GOOD_PRACTICES.md` is violated

## 7. When the Agent Is Unsure

Stop and surface the question in the response instead of guessing on:
payment provider choice, pricing/currency, auth strategy details beyond what's
in `PLAN.md`, or any change that would alter `DATABASE_DESIGN.md` structurally
mid-phase.
