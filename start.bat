@echo off
echo ============================================
echo  Starting Nestle Retailer Direct App
echo ============================================
echo.

REM Check if .env exists
if not exist .env (
    echo ERROR: .env file not found!
    echo Please run setup.bat first.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo ERROR: Dependencies not installed!
    echo Please run setup.bat first.
    pause
    exit /b 1
)

echo Starting Vite dev server (in background)...
start "Vite Dev Server" cmd /k "npm run dev"

echo.
echo Waiting for Vite to initialize (5 seconds)...
timeout /t 5 /nobreak > nul

echo.
echo Starting Laravel server...
echo.
echo ============================================
echo  Server is running!
echo  Open browser: http://localhost:8000
echo  Press Ctrl+C to stop Laravel server
echo  (Close both windows to fully stop)
echo ============================================
echo.

call php artisan serve
