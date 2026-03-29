# Nestle Retailer Direct - Quick Start Guide

## 🚀 For Non-Technical Users (Demo/Presentation)

### Prerequisites (Install These First)

1. **XAMPP** (includes PHP 8.2)
   - Download: https://www.apachefriends.org/
   - Install with default settings

2. **Node.js** (LTS version)
   - Download: https://nodejs.org/
   - Install with default settings

---

### Quick Setup (One Time Only)

1. **Extract** the ZIP file to a folder (e.g., `C:\Projects\Nestle-Retailer-Direct`)

2. **Double-click** `setup.bat` and wait for it to finish

3. **Double-click** `start.bat` to run the application

4. **Open your browser** and go to: **http://localhost:8000**

---

### That's It! 🎉

Your application is now running. Just show the website to your lecturers.

---

### Troubleshooting

**Problem:** "PHP is not installed"
- **Solution:** Make sure XAMPP is installed and Apache is started at least once

**Problem:** "Node.js is not installed"
- **Solution:** Download and install Node.js from the link above, then restart your computer

**Problem:** "Permission denied" or "Access denied"
- **Solution:** Right-click the `.bat` files and select "Run as Administrator"

**Problem:** Port 8000 is already in use
- **Solution:** Close any other running servers, or try: `php artisan serve --port=8080`

---

### For Developers

If you need to modify the project:

```bash
# Install dependencies
composer install
npm install

# Setup environment
copy .env.example .env
php artisan key:generate

# Build assets
npm run build

# Run development server
php artisan serve
```

---

**Good luck with your presentation! 📚✨**
