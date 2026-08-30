# GOOD_PRACTICES.md — Coding & Project Standards

Applies to every contribution — human or AI agent.

## 1. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| PHP classes | `PascalCase` | `QuoteRequestController` |
| PHP methods/vars | `camelCase` | `getFeaturedItems()` |
| DB tables | `snake_case`, plural | `portfolio_items` |
| DB columns | `snake_case` | `is_featured`, `published_at` |
| Routes (URI) | `kebab-case` | `/services/{category}/{item-slug}` |
| Route names | `dot.case` | `services.category.show` |
| React components | `PascalCase` file + export | `CategoryCard.jsx` |
| React props/vars | `camelCase` | `isFeatured` |
| Blade/Inertia page files | `PascalCase`, mirror route | `Pages/Public/ItemDetail.jsx` |

## 2. Laravel Backend Practices

- **Fat models, thin controllers, extract to Services when logic exceeds
  ~15 lines** (e.g. quote pricing, order total calculation) — put it in
  `app/Services`, not the controller.
- **Always use Form Requests** for validation (`php artisan make:request`).
  Never validate inline in the controller for anything beyond a single field.
- **Always define `$fillable` (not `$guarded = []`)** on every model —
  explicit allow-lists prevent mass-assignment vulnerabilities.
- **Use Policies for authorization** (`ItemPolicy`, `OrderPolicy`,
  `QuotePolicy`) rather than ad-hoc `if ($user->role === 'admin')` checks
  scattered in controllers.
- **Eager-load relationships** on every list/grid query
  (`Item::with('category', 'images')->get()`), never lazy-load inside a
  Blade/Inertia loop — this is the most common perf bug in this kind of app.
- **Soft deletes** on `items`, `portfolios`, `clients` — nothing a business
  owner manages through an admin panel should be hard-deleted by default.
- **Queue anything that talks to an external service** (emails on quote
  submission, image processing) — don't block the HTTP response.
- **File uploads** (portfolio images, client logos, item thumbnails): validate
  mime type + max size in the Form Request, store via `Storage::disk('public')`
  (or S3 in production), never trust the original filename.

## 3. Inertia + React Frontend Practices

- **One Inertia page component per route.** Shared UI goes in
  `resources/js/Components`, not duplicated across pages.
- **Type the props** each page receives (JSDoc or TypeScript, pick one for the
  whole project and stay consistent — see `PLAN.md` for the decision).
- **Never fetch data client-side for content that could be passed as an
  Inertia prop.** Only use `axios`/`fetch` for genuinely dynamic
  interactions (typeahead search, "load more" pagination) via Inertia's
  partial reloads (`router.reload({ only: [...] })`) or a lightweight JSON
  endpoint.
- **Forms use Inertia's `useForm` helper** (`processing`, `errors`, `reset()`)
  — don't hand-roll fetch + state for forms; you lose CSRF handling and
  consistent validation-error display.
- **Loading/empty/error states are mandatory** for every list view (category
  grid, portfolio grid, client list) — never ship a page that only handles
  the happy path.
- **Images:** use `loading="lazy"`, explicit `width`/`height` (or aspect-ratio
  CSS) to avoid layout shift, and a placeholder for missing thumbnails.

## 4. Database Practices

- Every table: `id`, timestamps (`created_at`, `updated_at`), and
  `deleted_at` where soft-deletes apply.
- Foreign keys always `constrained()->cascadeOnDelete()` or
  `nullOnDelete()` — decide per relationship, document the choice in
  `DATABASE_DESIGN.md`.
- Index every foreign key and every column used in a `WHERE`/`ORDER BY` on a
  public listing page (`category_id`, `is_featured`, `published_at`, `slug`).
- `slug` columns are unique and indexed; generate via a model observer, never
  trust user input directly for URLs.

## 5. Security Checklist

- [ ] CSRF protection on (default Laravel/Inertia behavior — don't disable it)
- [ ] Rate-limit the quote form and login/register routes
      (`throttle:6,1` or similar)
- [ ] Sanitize/validate all file uploads (mime + size + extension)
- [ ] Escape all user-generated content rendered in React (React does this by
      default — never use `dangerouslySetInnerHTML` on user input)
- [ ] Admin routes behind auth + role middleware, never just hidden by
      "no link in the UI"
- [ ] `.env` never committed; `APP_DEBUG=false` in production
- [ ] Payment/purchase flow: never trust a client-submitted price — always
      recompute the amount server-side from the `items` table before charging

## 6. Git Workflow

- `main` — always deployable.
- `feature/{short-name}` branches per task, merged via PR even if solo
  (keeps history reviewable).
- Commit messages: `type: short description` (`feat: add quote request form`,
  `fix: category slug 404 on uppercase input`, `chore: seed demo clients`).
- No direct commits of `node_modules`, `vendor`, `.env`, or build output.

## 7. Testing Expectations

- **Feature tests** (Laravel `Pest`/`PHPUnit`) for: quote submission, purchase
  flow, category/item routing, admin CRUD authorization.
- **At minimum**, every write endpoint (POST/PUT/PATCH/DELETE) needs one
  happy-path test and one authorization/validation-failure test.
- Run `php artisan test` before marking any backend task complete.

## 8. Performance

- Cache category/menu data (`OUR SERVICES` dropdown) — it changes rarely;
  invalidate the cache on admin save.
- Optimize/resize uploaded images on upload (thumbnail + full size), don't
  serve full-resolution originals in grid views.
- Paginate every public listing (portfolio grid, category grid, client list)
  — never `->get()` an unbounded table on a public page.
