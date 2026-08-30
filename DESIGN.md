# DESIGN.md — Design System & Page Specs

Source: the approved wireframe (`landing_page.pptx`, 8 slides). This document
translates that wireframe into a build spec. Every page listed here must be
built with Inertia + React and must reuse the shared `Header` / `Footer`.

## 1. Global Layout

Every public page shares the same shell:

```
┌───────────────────────────────────────────────────┐
│ Header  (sticky)                                   │
│ LOGO | SEARCH BAR | OUR SERVICES ▾ | PORTFOLIO |    │
│                     CLIENT (login/avatar) | FREE QUOTE (button) │
├───────────────────────────────────────────────────┤
│                                                     │
│           page content (varies per route)          │
│                                                     │
├───────────────────────────────────────────────────┤
│ Footer                                              │
└───────────────────────────────────────────────────┘
```

- **Header** is sticky on scroll.
- **"OUR SERVICES"** is a dropdown/mega-menu with three columns: **Apps**,
  **Website**, **Software** (see §3).
- **"FREE QUOTE"** is always a filled, high-contrast CTA button — it is the
  primary conversion action on every page.
- **CLIENT** icon: shows "Log in" when logged out, avatar + dropdown
  (Dashboard / My Orders / Logout) when logged in.

## 2. Design Tokens

| Token | Value | Notes |
|---|---|---|
| Primary | `#1E88E5` (blue) | CTAs, active nav state, category cards |
| Primary Dark | `#0D3B66` | header background variant, footer background |
| Neutral 900 | `#111827` | body text |
| Neutral 500 | `#6B7280` | secondary text |
| Neutral 100 | `#F3F4F6` | section backgrounds |
| Surface | `#FFFFFF` | cards |
| Success | `#22C55E` | order confirmed, quote submitted |
| Danger | `#EF4444` | validation errors |
| Radius | `8px` cards, `999px` pills/search bar | |
| Shadow | `0 2px 8px rgba(0,0,0,0.08)` | cards on hover: `0 6px 16px rgba(0,0,0,0.12)` |
| Font — heading | `Inter` / `Poppins`, 600–700 weight | |
| Font — body | `Inter`, 400–500 weight | |
| Spacing scale | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px | |
| Max content width | `1280px`, centered, `24px` side gutters on mobile | |

Do not use accent stripes/bars as decoration (dated pattern) — use whitespace,
subtle shadows, and background-tint sections instead.

## 3. Page: Home (`/`) — wireframe slide 1

1. **Hero section** — full-width video/image background, headline + subheadline
   + "Free Quote" CTA overlaid.
2. **"Swap latest products" strip** — auto-rotating/manually swappable row of
   3–4 featured items pulled from `items` where `is_featured = true`.
3. **Category quick-links** — three large cards: **App**, **Software**,
   **Website** — each links to `/services/{category}`.
4. **Footer**

## 4. Page: Our Services (`/services`) — wireframe slide 2

- Same header, with "OUR SERVICES" active.
- Three-column layout: **Apps / Website / Software**, each column listing that
  category's item names as links (pulled from `items` grouped by `category`).
- Clicking a category column header goes to `/services/{category}`.
- Clicking an item goes to `/services/{category}/{item-slug}`.

## 5. Page: Category detail (`/services/{category}`) — wireframe slides 3–5

Grid of category cards for the active category (e.g. Apps → *Make Secure
Pro/Prime, Prime Locker, Anti Theft, Child Care*; Website → *Ecommerce, Blog,
Portfolio, Business/Corporate*; Software → *Prime POS, Restaurant Management,
Mess Khata, Office Controller*).

- Each item card: icon/thumbnail, name, one-line description, "View" →
  item detail page.
- **"Every item gets its own page"** (explicit wireframe annotation) — each
  item must resolve to a real detail route, not a modal.
- Item detail page: gallery, full description, price (if purchasable),
  **Buy / Purchase** button, **Request Quote** button, related portfolio
  pieces for that item.

## 6. Page: Portfolio (`/portfolio`) — wireframe slide 6

- Hero carousel at top (rotating featured portfolio pieces).
- Below: filterable grid — **Portfolio Website / Portfolio Software /
  Portfolio POS Software** tabs/filters, each showing a grid of portfolio
  cards (cover image, title, category tag).
- Card click → `/portfolio/{slug}` detail page (gallery, client name,
  description, link to the related service item).

## 7. Page: Clients (`/clients`) — wireframe slide 7

- Simple vertical **client list**: logo, name, optional testimonial excerpt,
  optional link to their project in the portfolio.
- Keep this page scannable — no more than one client per row on desktop,
  logo + name inline on mobile.

## 8. Component Inventory

| Component | Used on | Notes |
|---|---|---|
| `Header` | all public pages | sticky, mega-menu, search |
| `SearchBar` | Header | typeahead against items + portfolio |
| `Footer` | all public pages | links, social, contact, copyright |
| `HeroBanner` | Home | video/image + CTA |
| `FeaturedStrip` | Home | swappable featured items |
| `CategoryCard` | Home, Services | icon + label |
| `ItemCard` | Category detail | thumbnail + name + short desc |
| `PortfolioCarousel` | Portfolio | auto-rotating |
| `PortfolioCard` | Portfolio | cover + title + tag |
| `ClientRow` | Clients | logo + name + testimonial |
| `QuoteForm` | Item detail, dedicated Quote page | name/email/phone/message |
| `PurchaseButton` | Item detail | opens checkout flow |

## 9. Responsive Rules

- **Breakpoints:** `sm 640px / md 768px / lg 1024px / xl 1280px`.
- Below `md`: header collapses "Our Services" and "Portfolio" into a hamburger
  menu; search bar becomes an icon that expands on tap; category grids drop
  from 3–4 columns to 1–2.
- Hero section height reduces from `70vh` (desktop) to `48vh` (mobile).

## 10. Accessibility

- All CTAs (`Free Quote`, `Buy`, `Request Quote`) must be real `<button>`/`<a>`
  elements, keyboard-reachable, with visible focus states.
- Color contrast on Primary Blue (`#1E88E5`) against white text must meet
  WCAG AA (verify at implementation time — swap in `#0D3B66` for text-heavy
  buttons if needed).
- All images (portfolio, item thumbnails, client logos) require `alt` text
  sourced from the corresponding DB record's name/title field.
