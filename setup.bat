@echo off
echo ============================================
echo  Nestle Retailer Direct - Full Setup
echo ============================================
echo.
echo This will automatically:
echo - Install Composer dependencies
echo - Install NPM dependencies
echo - Create .env file
echo - Generate app key
echo - Create MySQL database
echo - Run migrations
echo.
echo BEFORE RUNNING: Make sure XAMPP/MySQL is installed and MySQL is running!
echo.
pause

echo.
echo [1/7] Enabling PHP zip extension...
for /f "delims=" %%i in ('php -r "echo php_ini_loaded_file();"') do set PHP_INI=%%i
echo Found php.ini: %PHP_INI%
if exist "%PHP_INI%" (
    (findstr /i /v "^;extension=zip" "%PHP_INI%" | findstr /i /v "^extension=zip") > "%TEMP%\php_temp.ini"
    echo extension=zip >> "%TEMP%\php_temp.ini"
    copy /y "%TEMP%\php_temp.ini" "%PHP_INI%" >nul
    del "%TEMP%\php_temp.ini"
    echo Zip extension enabled in php.ini
) else (
    echo WARNING: Could not find php.ini file
)

echo.
echo [2/7] Installing Composer dependencies...
call composer install --no-interaction --prefer-dist
if errorlevel 1 (
    echo ERROR: Composer install failed!
    pause
    exit /b 1
)

echo.
echo [3/7] Installing NPM dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: NPM install failed!
    pause
    exit /b 1
)

echo.
echo [4/7] Setting up .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created.
) else (
    echo .env file already exists.
)

echo.
echo [5/7] Generating application key...
call php artisan key:generate

echo.
echo [6/7] Clearing caches...
call php artisan config:clear
call php artisan cache:clear
call php artisan view:clear

echo.
echo [7/7] Creating MySQL database...
for /f "tokens=3" %%a in ('findstr /i "DB_DATABASE" .env') do set DB_NAME=%%a
for /f "tokens=3" %%a in ('findstr /i "DB_USERNAME" .env') do set DB_USER=%%a
for /f "tokens=3" %%a in ('findstr /i "DB_PASSWORD" .env') do set DB_PASS=%%a

echo Dropping database if exists: %DB_NAME%
echo Creating database: %DB_NAME%

REM Create database using mysql command
mysql -u %DB_USER% -p%DB_PASS% -e "DROP DATABASE IF EXISTS %DB_NAME%;" 2>nul
mysql -u %DB_USER% -p%DB_PASS% -e "CREATE DATABASE %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if errorlevel 1 (
    echo.
    echo WARNING: Could not create database automatically.
    echo Please create database manually via phpMyAdmin:
    echo   Database name: %DB_NAME%
    echo.
    pause
)

echo.
echo [8/7] Running database migrations and seeding products...
call php artisan migrate:fresh --seed
if errorlevel 1 (
    echo.
    echo ERROR: Migration failed!
    echo Please check your database connection.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  Setup Complete!
echo  Run start.bat to start the development server
echo ============================================
echo.
pause
