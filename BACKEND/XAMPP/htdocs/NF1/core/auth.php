<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Gestió de sessions i cookies d'autenticació.
 *
 * Criteri:
 *  - La sessió PHP desa l'estat de l'usuari (id, nom, activitat): és
 *    informació sensible i només la coneix el servidor.
 *  - La cookie "nf1_remember" és optativa (Recorda'm) i només conté un
 *    token aleatori opac; el token real es verifica contra la BDD.
 *  - El temps de vida és de 40 minuts d'inactivitat (2400 s).
 */

/** Temps màxim d'inactivitat permès (40 minuts). */
define('NF1_SESSIO_SEGONS', 2400);

/** Nom de la cookie de recordatori. */
define('NF1_COOKIE_RECORDATORI', 'nf1_remember');

/** Dies que es conserva la cookie de recordatori. */
define('NF1_COOKIE_DIES', 30);

/**
 * Arrenca la sessió amb opcions segures i, si cal, recrea la identitat
 * a partir de la cookie de recordatori.
 *
 * S'ha de cridar abans de qualsevol sortida HTML.
 */
function iniciarSessio(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        $https = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';

        session_name('NF1SESSID');
        session_set_cookie_params([
            'lifetime' => 0,          // cookie de sessió: caduca en tancar el navegador
            'path' => '/',
            'secure' => $https,
            'httponly' => true,       // JavaScript no pot llegir la cookie de sessió
            'samesite' => 'Lax',      // protecció bàsica contra CSRF
        ]);
        ini_set('session.gc_maxlifetime', (string) NF1_SESSIO_SEGONS);
        session_start();
    }

    // Si no hi ha sessió autenticada, provem la cookie "Recorda'm".
    if (!isset($_SESSION['user_id']) && !empty($_COOKIE[NF1_COOKIE_RECORDATORI])) {
        $cookie = (string) $_COOKIE[NF1_COOKIE_RECORDATORI];
        $parts = explode(':', $cookie, 2);

        if (count($parts) === 2 && ctype_digit($parts[0])) {
            try {
                require_once __DIR__ . '/../Model/users.model.php';

                $usuari = (new Users())->buscarPerTokenRecordatori($parts[1], (int) $parts[0]);
                if ($usuari !== false) {
                    $_SESSION['user_id'] = (int) $usuari['id'];
                    $_SESSION['username'] = $usuari['username'];
                    $_SESSION['admin'] = (int) $usuari['admin'];
                    $_SESSION['last_activity'] = time();
                    session_regenerate_id(true);
                } else {
                    esborrarCookieRecordatori();
                }
            } catch (PDOException $error) {
                // Si la BDD no està disponible, la cookie es descarta sense trencar la pàgina.
                error_log('No s\'ha pogut validar la cookie de recordatori: ' . $error->getMessage());
                esborrarCookieRecordatori();
            }
        } else {
            esborrarCookieRecordatori();
        }
    }
}

/**
 * Comprova si hi ha un usuari autenticat i actualitza el seu temps
 * d'activitat. Si ha superat els 40 minuts, tanca la sessió.
 */
function usuariAutenticat(): bool
{
    if (!isset($_SESSION['user_id'], $_SESSION['last_activity'])) {
        return false;
    }

    if (time() - (int) $_SESSION['last_activity'] > NF1_SESSIO_SEGONS) {
        tancarSessioUsuari();
        return false;
    }

    $_SESSION['last_activity'] = time();
    return true;
}

/** Retorna l'id de l'usuari autenticat o null. */
function idUsuariActual(): ?int
{
    return usuariAutenticat() ? (int) $_SESSION['user_id'] : null;
}

/** Retorna el nom visible de l'usuari autenticat o una cadena buida. */
function nomUsuariActual(): string
{
    return usuariAutenticat() ? (string) ($_SESSION['username'] ?? '') : '';
}

/** Indica si l'usuari autenticat té permisos d'administrador. */
function esAdminActual(): bool
{
    return usuariAutenticat() && (int) ($_SESSION['admin'] ?? 0) === 1;
}

/**
 * Estableix la sessió de l'usuari després d'una autenticació correcta.
 * Si $recordar és cert, genera un token i desa la cookie persistent.
 */
function iniciarSessioUsuari(int $id, string $username, int $admin, bool $recordar): void
{
    session_regenerate_id(true);

    $_SESSION['user_id'] = $id;
    $_SESSION['username'] = $username;
    $_SESSION['admin'] = $admin;
    $_SESSION['last_activity'] = time();

    if ($recordar) {
        require_once __DIR__ . '/../Model/users.model.php';

        $token = bin2hex(random_bytes(32));
        $model = new Users();
        $model->desarTokenRecordatori($id, hash('sha256', $token));

        $https = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        setcookie(
            NF1_COOKIE_RECORDATORI,
            $id . ':' . $token,
            time() + NF1_COOKIE_DIES * 24 * 60 * 60,
            '/',
            '',
            $https,
            true
        );
        $_COOKIE[NF1_COOKIE_RECORDATORI] = $id . ':' . $token;
    }
}

/** Desa un missatge flash per mostrar-lo a la propera pàgina. */
function posarFlash(string $tipus, string $missatge): void
{
    $_SESSION['flash'] = ['tipus' => $tipus, 'missatge' => $missatge];
}

/** Llegeix i esborra el missatge flash. */
function treureFlash(): array
{
    $flash = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    return is_array($flash) ? $flash : [];
}

/** Tanca la sessió i elimina la cookie de recordatori. */
function tancarSessioUsuari(): void
{
    if (isset($_SESSION['user_id'])) {
        try {
            require_once __DIR__ . '/../Model/users.model.php';
            (new Users())->esborrarTokenRecordatori((int) $_SESSION['user_id']);
        } catch (PDOException $error) {
            error_log('No s\'ha pogut esborrar el token de recordatori: ' . $error->getMessage());
        }
    }

    $_SESSION = [];
    esborrarCookieRecordatori();

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }
}

/** Esborra la cookie de recordatori del navegador. */
function esborrarCookieRecordatori(): void
{
    if (isset($_COOKIE[NF1_COOKIE_RECORDATORI])) {
        $https = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        setcookie(NF1_COOKIE_RECORDATORI, '', time() - 3600, '/', '', $https, true);
        unset($_COOKIE[NF1_COOKIE_RECORDATORI]);
    }
}

/** Redirigeix al formulari d'accés si no hi ha usuari autenticat. */
function requerirUsuari(): void
{
    if (!usuariAutenticat()) {
        posarFlash('error', 'Has d\'iniciar sessió per realitzar aquesta acció.');
        // Les peticions es serveixen des de l'arrel de /NF1/, no des de view/ ni Controller/.
        header('Location: login.php');
        exit;
    }
}
