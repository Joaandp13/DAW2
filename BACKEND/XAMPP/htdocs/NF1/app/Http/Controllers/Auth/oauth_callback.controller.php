<?php
/**
 * Callback OAuth: recibe la respuesta del proveedor, crea/vincula el usuario
 * y abre la sesión local de NF1.
 */

require_once __DIR__ . '/../../../Core/auth.php';
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../Models/users.model.php';

iniciarSessio();

$proveidorsPermesos = ['GitHub','Discord'];
$provider = (string) ($_GET['provider'] ?? $_SESSION['nf1_oauth_provider'] ?? '');

if (!in_array($provider, $proveidorsPermesos, true)) {
    posarFlash('error', 'Proveïdor OAuth no vàlid.');
    header('Location: /login');
    exit;
}
unset($_SESSION['nf1_oauth_provider']);

$config = require __DIR__ . '/../../../../config/hybridauth.php';

try {
    $hybridauth = new Hybridauth\Hybridauth($config);
    $adapter = $hybridauth->authenticate($provider);
    $profile = $adapter->getUserProfile();
    $adapter->disconnect();

    $uid = trim((string) ($profile->identifier ?? ''));
    $email = trim((string) ($profile->email ?? ''));
    $display = trim((string) ($profile->displayName ?? ''));
    $nickname = trim((string) ($profile->username ?? $profile->displayName ?? ''));

    if ($uid === '') {
        posarFlash('error', $provider . ' no ha retornat un identificador d\'usuari vàlid.');
        header('Location: /login');
        exit;
    }

    // GitHub puede no devolver email público; en ese caso hay que decidir política.
    if ($email === '') {
        posarFlash('error', $provider . ' no ha retornat el correu. Revisa la configuració de privacitat del teu compte.');
        header('Location: /login');
        exit;
    }

    $users = new Users();

    // 1) ¿Ya existe este usuario OAuth?
    $usuari = $users->buscarPerOAuth($provider, $uid);

    if ($usuari === false) {
        // 2) Si el email ya existe, vinculamos la cuenta OAuth a ese usuario.
        // Revisa esta política si quieres exigir verificación adicional.
        $existentPerEmail = $users->buscarPerEmail($email);

        if ($existentPerEmail !== false) {
            $users->vincularOAuth((int) $existentPerEmail['id'], $provider, $uid);
            $usuari = $users->buscarPerOAuth($provider, $uid);
        } else {
            // 3) Crear usuario nuevo con username único
            $base = preg_replace('/[^a-zA-Z0-9_]/', '', $nickname !== '' ? $nickname : $display);
            if ($base === '') {
                $base = strstr($email, '@', true) ?: strtolower($provider) . '_user';
            }
            $base = substr($base, 0, 40);
            $username = $base;
            $i = 1;
            while ($users->buscarPerUsername($username) !== false) {
                $sufix = (string) $i++;
                $username = substr($base, 0, 50 - strlen($sufix)) . $sufix;
            }

            $nouId = $users->registrarOAuth($email, $username, $provider, $uid);
            $usuari = [
                'id' => $nouId,
                'username' => $username,
                'admin' => 0,
            ];
        }
    }

    iniciarSessioUsuari(
        (int) $usuari['id'],
        (string) $usuari['username'],
        (int) ($usuari['admin'] ?? 0),
        false
    );

    posarFlash('ok', 'Sessió iniciada amb ' . $provider . '.');
    header('Location: /');
    exit;

} catch (Throwable $e) {
    error_log('OAuth callback error: ' . $e->getMessage());
    posarFlash('error', 'Error en autenticar amb ' . $provider . '.');
    header('Location: /login');
    exit;
}
