<?php

$autoload = __DIR__ . '/../vendor/autoload.php';
if (is_file($autoload)) {
    require_once $autoload;
}

if (class_exists(Dotenv\Dotenv::class)) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->safeLoad();
}

$appUrl = rtrim((string) ($_ENV['APP_URL'] ?? getenv('APP_URL') ?: 'http://nf1.local'), '/');

return [
    'callback' => $appUrl . '/oauth-callback',
    'providers' => [
        'GitHub' => [
            'enabled' => true,
            'keys' => [
                'id' => $_ENV['GITHUB_CLIENT_ID'] ?? getenv('GITHUB_CLIENT_ID') ?: '',
                'secret' => $_ENV['GITHUB_CLIENT_SECRET'] ?? getenv('GITHUB_CLIENT_SECRET') ?: '',
            ],
            'scope' => 'user:email',
        ],
        'Discord' => [
            'enabled' => true,
            'keys' => [
                'id' => $_ENV['DISCORD_CLIENT_ID'] ?? getenv('DISCORD_CLIENT_ID') ?: '',
                'secret' => $_ENV['DISCORD_CLIENT_SECRET'] ?? getenv('DISCORD_CLIENT_SECRET') ?: '',
            ],
            'scope' => 'identify email',
        ],
    ],
];