# Installation Guide - Nestle Retailer Direct

## Quick Start (3 Easy Steps)

### Step 1: Install Prerequisites
Download and install these first:
- **XAMPP** (includes MySQL) - https://www.apachefriends.org/download.html
- **PHP 8.2+** - https://windows.php.net/download/
- **Composer** - https://getcomposer.org/download/
- **Node.js 18+** - https://nodejs.org/

### Step 2: Start MySQL
- Open **XAMPP Control Panel**
- Click **Start** next to **MySQL**
- Wait until it shows "Running"

### Step 3: Setup Project
- Download/extract this project from GitHub
- Double-click **`setup.bat`** (runs once)
- Double-click **`start.bat`** (run every time)
- Open browser: **http://localhost:8000**

---

## Default Login

After setup, login with:
- **Email:** admin@example.com
- **Password:** password

---

## Troubleshooting

### "MySQL connection error"
- Make sure MySQL is running in XAMPP
- Check `.env` file has correct password (default: empty)

### "npm install fails"
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` in terminal

### "Composer install fails"
- Run `composer clear-cache` in terminal
- Try `composer install` again

### "Database not found"
- Open phpMyAdmin: http://localhost/phpmyadmin
- Create database: `nestle-retailer-direct_db`
- Run `setup.bat` again

---

## What the Bat Files Do

### setup.bat (Run Once)
```
✓ composer install
✓ npm install
✓ Create .env file
✓ Generate app key
✓ Create MySQL database
✓ Run migrations + seed data
```

### start.bat (Run Every Time)
```
✓ npm run dev (Vite dev server)
✓ php artisan serve (Laravel server)
```
