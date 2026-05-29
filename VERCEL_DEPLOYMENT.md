# Vercel Deployment Notes

Live URL: https://nestle-retailer-direct-five.vercel.app

This project is a Laravel 12 + Inertia React app. Vercel can run it through the community `vercel-php` runtime configured in `vercel.json`.

## Before deploying

1. Run `npm.cmd run build` locally and keep `public/build` included in the deploy.
2. In Vercel project settings, add environment variables from `.env` without committing secrets.
3. Use a real remote database for full functionality. Vercel functions have a read-only filesystem, so local MySQL and writable SQLite will not work in production.

Recommended Vercel environment values:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://nestle-retailer-direct-five.vercel.app
ASSET_URL=https://nestle-retailer-direct-five.vercel.app
LOG_CHANNEL=stderr
VIEW_COMPILED_PATH=/tmp/laravel/views
APP_KEY=base64:your-generated-key
SESSION_DRIVER=cookie
CACHE_STORE=array
QUEUE_CONNECTION=sync
DB_CONNECTION=mysql
DB_HOST=your_remote_db_host
DB_PORT=3306
DB_DATABASE=your_remote_db_name
DB_USERNAME=your_remote_db_user
DB_PASSWORD=your_remote_db_password
```

Generate an app key with:

```bash
php artisan key:generate --show
```

## Deploy commands

```bash
npm.cmd run build
npx vercel login
npx vercel --scope ubaish-s-projects
npx vercel --prod --scope ubaish-s-projects
```

## Undo Codex Vercel setup

A safety branch was created before these changes:

```bash
git switch before-codex-vercel-setup
```

Or, from `main`, remove only the deployment files and restore `.gitignore`:

```bash
git restore .gitignore
del vercel.json
```
