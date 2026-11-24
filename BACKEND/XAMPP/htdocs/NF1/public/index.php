<?php
/**
 * Front controller / router simple.
 * Totes les peticions no estàtiques passen per aquí (veure .htaccess).
 */
define('BASE_PATH', dirname(__DIR__));
define('APP_PATH', BASE_PATH . '/app');
define('VIEWS_PATH', BASE_PATH . '/resources/views');
define('CONFIG_PATH', BASE_PATH . '/config');

$autoload = BASE_PATH . '/vendor/autoload.php';
if (is_file($autoload)) {
    require_once $autoload;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$uri = '/' . trim($uri, '/');
if ($uri !== '/') {
    $uri = rtrim($uri, '/');
}

// Rutes simples: [mètode, ruta] => handler (relatiu a BASE_PATH)
$routes = [
    'GET /'                => 'app/Http/Controllers/Article/paginacio.controller.php',
    'POST /'               => 'app/Http/Controllers/Article/article.controller.php',
    'GET /login'           => 'app/Http/Controllers/Users/login.controller.php',
    'POST /login'          => 'app/Http/Controllers/Users/login.controller.php',
    'GET /register'        => 'app/Http/Controllers/Users/register.controller.php',
    'POST /register'       => 'app/Http/Controllers/Users/register.controller.php',
    'GET /recuperar'       => 'app/Http/Controllers/Users/recuperar.controller.php',
    'POST /recuperar'      => 'app/Http/Controllers/Users/recuperar.controller.php',
    'GET /logout'          => 'app/Http/Controllers/Users/logout.controller.php',
    'GET /build'           => 'app/Http/Controllers/Article/build.controller.php',
    'GET /build-form'      => 'app/Http/Controllers/Article/build_form.controller.php',
    'POST /build-form'     => 'app/Http/Controllers/Article/article.controller.php',
    'POST /build-like'     => 'app/Http/Controllers/Article/like.controller.php',
    'GET /personatges'     => 'app/Http/Controllers/Admin/personatges.controller.php',
    'POST /personatges'    => 'app/Http/Controllers/Admin/personatges.controller.php',
    'GET /oauth'           => 'app/Http/Controllers/Auth/oauth.controller.php',
    'GET /oauth-callback'  => 'app/Http/Controllers/Auth/oauth_callback.controller.php',
];

// Compatibilitat amb URLs antigues .php
$legacyRedirects = [
    '/index.php'        => '/',
    '/login.php'        => '/login',
    '/register.php'     => '/register',
    '/recuperar.php'    => '/recuperar',
    '/logout.php'       => '/logout',
    '/build.php'        => '/build' . (isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] !== '' ? '?' . $_SERVER['QUERY_STRING'] : ''),
    '/build_form.php'   => '/build-form' . (isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] !== '' ? '?' . $_SERVER['QUERY_STRING'] : ''),
    '/build_like.php'   => '/build-like',
    '/personatges.php'  => '/personatges',
    '/oauth.php'        => '/oauth' . (isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] !== '' ? '?' . $_SERVER['QUERY_STRING'] : ''),
    '/oauth_callback.php' => '/oauth-callback' . (isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] !== '' ? '?' . $_SERVER['QUERY_STRING'] : ''),
];

if (isset($legacyRedirects[$uri])) {
    header('Location: ' . $legacyRedirects[$uri], true, 302);
    exit;
}

$key = $method . ' ' . $uri;
if (isset($routes[$key])) {
    require BASE_PATH . '/' . $routes[$key];
    exit;
}

http_response_code(404);
echo '404 Not Found';