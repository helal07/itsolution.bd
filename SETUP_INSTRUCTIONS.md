# SETUP_INSTRUCTIONS.md — Local Environment Setup

## 1. Prerequisites

| Tool | Version | Check |
|---|---|---|
| PHP | 8.2+ | `php -v` |
| Composer | 2.x | `composer -V` |
| Node.js | 18+ (20 LTS recommended) | `node -v` |
| npm | 9+ | `npm -v` |
| MySQL | 8.0+ | `mysql --version` |
| Git | any recent | `git --version` |
| Antigravity IDE | latest | with AI agent enabled |

Required PHP extensions: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`,
`xml`, `ctype`, `json`, `bcmath`, `fileinfo`, `gd` (for image handling).

## 2. Create the Project

```bash
composer create-project laravel/laravel service-site
cd service-site
```

## 3. Install Breeze (Inertia + React)

```bash
composer require laravel/breeze --dev
php artisan breeze:install react
npm install
```

This scaffolds Inertia, React, Tailwind, and auth (login/register/password
reset) — matching the stack this project is built on.

## 4. MySQL Setup

Create the database:

```sql
CREATE DATABASE service_site CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'service_site_user'@'localhost' IDENTIFIED BY 'choose_a_strong_password';
GRANT ALL PRIVILEGES ON service_site.* TO 'service_site_user'@'localhost';
FLUSH PRIVILEGES;
```

## 5. Environment Configuration

Copy and edit `.env`:

```bash
cp .env.example .env
php artisan key:generate
```

Set these values in `.env`:

```
APP_NAME="Service Site"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=service_site
DB_USERNAME=service_site_user
DB_PASSWORD=choose_a_strong_password

MAIL_MAILER=log
FILESYSTEM_DISK=public
```

(Switch `MAIL_MAILER` to a real driver — e.g. `smtp` — once quote-notification
emails need to actually send.)

## 6. Run Migrations & Seeders

```bash
php artisan storage:link
php artisan migrate:fresh --seed
```

This creates all tables from `DATABASE_DESIGN.md` and loads demo data from
`PLAN.md` §"Seeding Plan".

## 7. Tailwind Config

Add the design tokens from `DESIGN.md` §2 to `tailwind.config.js` under
`theme.extend.colors` / `theme.extend.fontFamily` so components can use
`bg-primary`, `text-primary-dark`, etc. consistently instead of raw hex values.

## 8. Run the Dev Servers

Two terminals (or a `composer.json` `dev` script combining both):

```bash
php artisan serve        # backend, http://localhost:8000
npm run dev               # Vite dev server for Inertia/React
```

Visit `http://localhost:8000`.

## 9. Antigravity IDE Notes

- Open the project root (`service-site/`) as the workspace so the agent can
  see `AGENT.md`, `DESIGN.md`, `PLAN.md`, `DATABASE_DESIGN.md`, and
  `GOOD_PRACTICES.md` alongside the code — the agent is expected to read
  these before generating anything (see `AGENT.md` §1).
- Point the AI agent's "project instructions" / system context setting at
  `AGENT.md` if Antigravity supports pinning a file as persistent context.
- Keep `PLAN.md` open/pinned during a session — the agent updates checkboxes
  as it completes phases, so treat it as the live task tracker.

## 10. Recommended VS Code / Antigravity Extensions

- Laravel-specific: Laravel Blade formatter (not critical since this is
  Inertia-first, but useful for the few Blade files that remain, e.g. `app.blade.php`)
- PHP Intelephense (or Antigravity's built-in PHP language support)
- ESLint + Prettier for the `resources/js` React code
- Tailwind CSS IntelliSense

## 11. Verify the Setup

- [ ] `http://localhost:8000` loads the Home page shell
- [ ] `php artisan migrate:status` shows all migrations run
- [ ] `php artisan tinker` → `App\Models\Item::count()` returns seeded rows
- [ ] `npm run build` completes without errors (production build sanity check)
- [ ] `php artisan test` passes (once Phase 1+ tests exist)

## 12. Production Deployment Checklist (summary — see `PLAN.md` Phase 12)

```bash
composer install --optimize-autoloader --no-dev
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link
```

Set `APP_ENV=production`, `APP_DEBUG=false`, real mail driver, and real DB
credentials in the production `.env`. Never deploy with the `.env` used in
local development.
