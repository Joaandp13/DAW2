<?php
/**
 * Inicia el flujo OAuth con un proveedor soportado (de momento, GitHub y Discord).
 */
require_once __DIR__ . '/../../../Core/auth.php';
require_once __DIR__ . '/../../../../vendor/autoload.php';

iniciarSessio();

$proveidorsPermesos = ['GitHub','Discord'];
$provider = (string) ($_GET['provider'] ?? '');

if (!in_array($provider, $proveidorsPermesos, true)) {
    echo($provider);
    posarFlash('error', 'Proveïdor OAuth no vàlid.');
    header('Location: /login');
    exit;
}

$config = require __DIR__ . '/../../../../config/hybridauth.php';
$_SESSION['nf1_oauth_provider'] = $provider;

try {
    $hybridauth = new Hybridauth\Hybridauth($config);
    $hybridauth->authenticate($provider); // Redirige al proveedor
    // Hybridauth normalmente redirige; si vuelve aquí, enviamos al callback.
    header('Location: /oauth-callback?provider=' . rawurlencode($provider));
    exit;
} catch (Throwable $e) {
    error_log('OAuth start error: ' . $e->getMessage());
    posarFlash('error', 'No s\'ha pogut iniciar la sessió amb ' . $provider . '.');
    header('Location: /login');
    exit;
}
