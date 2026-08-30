# 🚀 IT SOLUTIONS — Enterprise IT Agency & Services Platform

A high-performance, modern Web & IT Agency Platform built with **Laravel 11**, **Inertia.js**, **React 18**, **Tailwind CSS**, and **MySQL/SQLite**.

---

## 🌟 Key Features

- **Public Frontend**:
  - Dynamic Hero & Services showcase (Apps, Web, Enterprise Software).
  - Portfolio Case Studies with live metrics & tech stack badges.
  - Interactive Quotation Builder with real-time budget calculation & SMS notifications.
  - Client Reviews & Ratings with star verification.
  - Global Search with live typeahead API.
  - Customer Checkout with direct online ordering & automated transaction generation.
- **Unified Profile Hub**:
  - Customer profile editor, active orders tracker, and review submission.
- **Enterprise Admin Suite (`/admin`)**:
  - **Orders & Invoices**: Lifecycle tracker, progress bar, instant payment logger.
  - **Quotations**: Review, approve, and 1-click convert into active CRM clients & projects.
  - **Users Directory**: Website-registered customer directory with 1-click CRM conversion & order creator.
  - **Clients & CRM**: Corporate clients, payment ledger, due balance calculator, WhatsApp contact.
  - **Services & Products**: CRUD with custom pricing, thumbnails, and feature highlights.
  - **Staff Team**: Employees directory with role-based access.
  - **Site Settings**: Dynamic site name, logo upload, email, phone, and address syncing instantly across Public & Admin views.

---

## 📋 Server Requirements

- **PHP**: `^8.2` or `^8.3` (with `pdo`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `curl`)
- **Composer**: `^2.0`
- **Database**: MySQL `^8.0` / MariaDB `^10.4` or SQLite `^3.35`
- **Web Server**: Apache (`mod_rewrite` enabled) or Nginx
- **Node.js** *(Optional - production assets are pre-compiled in `public/build`)*: `^18.0` or `^20.0`

---

## ⚡ Quick Deployment Guide (2-Minute Setup)

### 1. Clone Repository
```bash
git clone https://github.com/sowayebahmedrafee-blip/ITS_website.git
cd ITS_website
```

### 2. Install Dependencies
```bash
composer install --no-dev --optimize-autoloader
```

### 3. Setup Environment File
```bash
cp .env.example .env
```
Open `.env` and configure your database and application URL:
```ini
APP_NAME="IT SOLUTIONS"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=its_website
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

### 4. Generate Application Key & Storage Link
```bash
php artisan key:generate
php artisan storage:link
```

### 5. Run Database Migrations & Seed Default Data
```bash
php artisan migrate --seed --force
```

### 6. Cache Configuration for Production Speed
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🔑 Default Administrator Credentials

Once the database is seeded (`php artisan db:seed`), you can log into the Admin Suite:

- **Login URL**: `https://yourdomain.com/login`
- **Admin Panel**: `https://yourdomain.com/admin`
- **Admin Email**: `admin@itsolutions.com`
- **Admin Password**: `password`

*(Please change the administrator password after first login from Admin Panel > Users or Profile)*

---

## 🛠️ Development & Custom Build

If you wish to modify React components or recompile assets:

```bash
# Install NPM packages
npm install

# Start local development server with Hot Module Replacement (HMR)
npm run dev

# Compile optimized assets for production
npm run build
```

---

## 🌐 Web Server Configuration

### Nginx Virtual Host Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/ITS_website/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Apache (`.htaccess`)
Ensure `mod_rewrite` is enabled and `DocumentRoot` points to the `public/` directory.

### Directory Permissions
Ensure write permissions for the web server user (`www-data` or `nginx`):
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

---

## 🧪 Testing

Run the automated test suite:
```bash
php artisan test
```
All 47 unit & feature test cases will execute and validate routes, authentications, order creation, quotes, and CRM client workflows.

---

## 📄 License
This platform is proprietary software developed for IT SOLUTIONS. All rights reserved.
