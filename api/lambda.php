<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

if (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https') {
    $_SERVER['HTTPS'] = 'on';
    $_SERVER['SERVER_PORT'] = '443';
}

$runtimePath = '/tmp/laravel';
foreach (['cache', 'sessions', 'views'] as $directory) {
    $path = $runtimePath.'/'.$directory;

    if (! is_dir($path)) {
        mkdir($path, 0755, true);
    }
}

$runtimeEnvironment = [
    'VIEW_COMPILED_PATH' => $runtimePath.'/views',
    'LOG_CHANNEL' => 'stderr',
    'SESSION_DRIVER' => getenv('SESSION_DRIVER') ?: 'cookie',
    'CACHE_STORE' => getenv('CACHE_STORE') ?: 'array',
    'QUEUE_CONNECTION' => getenv('QUEUE_CONNECTION') ?: 'sync',
];

foreach ($runtimeEnvironment as $key => $value) {
    if (getenv($key) === false || getenv($key) === '') {
        putenv($key.'='.$value);
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
