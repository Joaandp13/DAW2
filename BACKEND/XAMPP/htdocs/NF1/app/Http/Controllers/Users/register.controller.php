<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Controlador del registre. Valida les dades, comprova que l'usuari no
 * existeixi i desa la contrasenya encriptada amb password_hash().
 */
require_once __DIR__ . '/../../../Core/auth.php';
require_once __DIR__ . '/../../../Core/validacio.php';
require_once __DIR__ . '/../../../Models/users.model.php';

iniciarSessio();

if (usuariAutenticat()) {
    header('Location: /');
    exit;
}

/**
 * Valida tot el formulari de registre.
 * Retorna un array de missatges d'error (buit si tot és correcte).
 */
function validarRegistro(array $dades, Users $model): array
{
    $errors = [];

    $username = textNet($dades['username'] ?? null);
    $email = textNet($dades['email'] ?? null);
    $password = is_string($dades['password'] ?? null) ? $dades['password'] : '';
    $password2 = is_string($dades['password2'] ?? null) ? $dades['password2'] : '';

    if (!nomUsuariValid($username)) {
        $errors[] = 'El nom d\'usuari ha de tenir entre 3 i 30 caràcters (lletres, números, punt, guió o guió baix).';
    } elseif ($model->buscarPerUsername($username) !== false) {
        $errors[] = 'Aquest nom d\'usuari ja existeix.';
    }

    if (!correuValid($email)) {
        $errors[] = 'L\'adreça de correu no és vàlida.';
    } elseif ($model->buscarPerEmail($email) !== false) {
        $errors[] = 'Aquest correu ja està registrat.';
    }

    $errorContrasenya = errorContrasenya($password);
    if ($errorContrasenya !== null) {
        $errors[] = $errorContrasenya;
    }

    if ($password !== $password2) {
        $errors[] = 'Les contrasenyes no coincideixen.';
    }

    return $errors;
}

$errors = [];
$valors = ['username' => '', 'email' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $valors = [
        'username' => textNet($_POST['username'] ?? null),
        'email' => textNet($_POST['email'] ?? null),
    ];

    try {
        $model = new Users();
        $errors = validarRegistro($_POST, $model);

        if ($errors === []) {
            $hash = password_hash($_POST['password'], PASSWORD_DEFAULT);

            if ($model->register_user($valors['username'], $valors['email'], $hash)) {
                posarFlash('ok', 'Registre completat. Ja pots iniciar sessió.');
                header('Location: /login');
                exit;
            }

            $errors[] = 'No s\'ha pogut registrar l\'usuari. Torna-ho a provar.';
        }
    } catch (PDOException $error) {
        error_log('Error en registrar l\'usuari: ' . $error->getMessage());
        $errors[] = 'No s\'ha pogut completar el registre. Torna-ho a provar més tard.';
    }
}

require __DIR__ . '/../../../../resources/views/Users/register.php';
