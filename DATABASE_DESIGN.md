# DATABASE_DESIGN.md — MySQL Schema

Engine: MySQL 8+. All tables `InnoDB`, `utf8mb4_unicode_ci`. Every table has
`id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`, `created_at`, `updated_at`;
tables marked **(soft delete)** also get `deleted_at NULL`.

## 1. Entity Overview

```
users ──< orders >── items ──< item_images
  │                     │
  │                     └──< quotes
  │                     │
categories ──< items    └──< portfolios ──< portfolio_images
                                  │
clients ──< portfolios (nullable client_id)
site_settings (singleton-style key/value)
```

## 2. Tables

### `users`
| Column | Type | Notes |
|---|---|---|
| name | varchar(150) | |
| email | varchar(191) | unique |
| email_verified_at | timestamp | nullable |
| password | varchar(255) | hashed |
| role | enum('client','admin') | default `client` |
| phone | varchar(30) | nullable |
| remember_token | varchar(100) | nullable |

### `categories` — Apps / Website / Software
| Column | Type | Notes |
|---|---|---|
| name | varchar(100) | e.g. "Apps" |
| slug | varchar(120) | unique, indexed |
| icon | varchar(255) | nullable, icon key or path |
| description | text | nullable |
| sort_order | int | default 0 |

### `items` **(soft delete)** — the purchasable/quotable service items
(e.g. Prime Locker, Anti Theft, Ecommerce, Prime POS, Restaurant Management)
| Column | Type | Notes |
|---|---|---|
| category_id | FK → categories.id | `cascadeOnDelete` |
| name | varchar(150) | |
| slug | varchar(180) | unique, indexed |
| short_description | varchar(255) | for grid cards |
| description | longtext | detail page body |
| thumbnail | varchar(255) | image path |
| price | decimal(10,2) | nullable if quote-only |
| is_purchasable | boolean | default true |
| is_featured | boolean | default false, indexed |
| status | enum('draft','published') | default `draft`, indexed |
| published_at | timestamp | nullable |

### `item_images`
| Column | Type | Notes |
|---|---|---|
| item_id | FK → items.id | `cascadeOnDelete` |
| image_path | varchar(255) | |
| sort_order | int | default 0 |

### `clients` **(soft delete)** — shown on the Clients page
| Column | Type | Notes |
|---|---|---|
| name | varchar(150) | |
| logo | varchar(255) | nullable |
| website_url | varchar(255) | nullable |
| testimonial | text | nullable |
| sort_order | int | default 0 |

### `portfolios` **(soft delete)** — showcased finished work
| Column | Type | Notes |
|---|---|---|
| item_id | FK → items.id | nullable, `nullOnDelete` — links back to the service category |
| client_id | FK → clients.id | nullable, `nullOnDelete` |
| title | varchar(180) | |
| slug | varchar(200) | unique, indexed |
| type | enum('website','software','pos_software') | matches Portfolio page filters, indexed |
| cover_image | varchar(255) | |
| description | longtext | nullable |
| project_url | varchar(255) | nullable |
| is_featured | boolean | default false — drives the homepage/portfolio carousel |
| completed_at | date | nullable |

### `portfolio_images`
| Column | Type | Notes |
|---|---|---|
| portfolio_id | FK → portfolios.id | `cascadeOnDelete` |
| image_path | varchar(255) | |
| sort_order | int | default 0 |

### `quotes` — "Free Quote" / "Request Quote" submissions
| Column | Type | Notes |
|---|---|---|
| item_id | FK → items.id | nullable, `nullOnDelete` — quote may be general |
| name | varchar(150) | |
| email | varchar(191) | |
| phone | varchar(30) | nullable |
| message | text | nullable |
| status | enum('new','contacted','won','lost') | default `new`, indexed |

### `orders` — purchases
| Column | Type | Notes |
|---|---|---|
| user_id | FK → users.id | `cascadeOnDelete` |
| item_id | FK → items.id | `restrictOnDelete` (keep order history even if item is later removed from sale) |
| amount | decimal(10,2) | server-recomputed at purchase time, never trust client input |
| currency | varchar(3) | default `USD` (or `BDT` — confirm with business) |
| status | enum('pending','paid','failed','refunded') | default `pending`, indexed |
| payment_method | varchar(50) | nullable |
| transaction_id | varchar(150) | nullable, unique when present |

### `site_settings` — key/value store for small global content
| Column | Type | Notes |
|---|---|---|
| key | varchar(100) | unique |
| value | text | nullable |

Suggested keys: `hero_video_url`, `hero_headline`, `hero_subheadline`,
`contact_email`, `contact_phone`, `social_links` (JSON-encoded).

## 3. Relationships Summary (Eloquent)

```
User          hasMany   Order
Category      hasMany   Item
Item          belongsTo Category
Item          hasMany   ItemImage
Item          hasMany   Quote
Item          hasMany   Order
Item          hasMany   Portfolio
Client        hasMany   Portfolio
Portfolio     belongsTo Item (nullable)
Portfolio     belongsTo Client (nullable)
Portfolio     hasMany   PortfolioImage
```

## 4. Indexing Notes

- `items.slug`, `portfolios.slug`, `categories.slug` — unique + indexed
  (used directly in public URLs).
- `items.is_featured`, `items.status`, `portfolios.is_featured`,
  `portfolios.type`, `quotes.status`, `orders.status` — indexed; all are
  filtered on in public or admin listing queries.
- Composite index on `items(category_id, status, published_at)` for the
  category listing page query.

## 5. Migration Order

1. `users` (Breeze default, extended with `role`, `phone`)
2. `categories`
3. `items`
4. `item_images`
5. `clients`
6. `portfolios`
7. `portfolio_images`
8. `quotes`
9. `orders`
10. `site_settings`

## 6. Seeding Plan (for local/dev)

- 3 categories (Apps, Website, Software)
- 4 items per category (matching the wireframe names: Make Secure Pro/Prime,
  Prime Locker, Anti Theft, Child Care / Ecommerce, Blog, Portfolio, Business
  & Corporate / Prime POS, Restaurant Management, Mess Khata, Office
  Controller)
- 6–8 portfolio pieces spread across the three `type` values
- 4–6 demo clients
- A handful of demo quotes and orders in mixed statuses, for admin UI testing
