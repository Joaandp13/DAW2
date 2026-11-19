<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Recuperació de contrasenya (opcional de l'enunciat):
 * 1) es demana el correu i s'envia un token vàlid durant una hora;
 * 2) amb el token es defineix una contrasenya nova confirmada.
 */
require_once __DIR__ . '/../../core/auth.php';
require_once __DIR__ . '/../../core/validacio.php';
require_once __DIR__ . '/../../Model/users.model.php';
require_once __DIR__ . '/../../Model/mail.model.php';

iniciarSessio();

$errors = [];
$missatge = '';
$token = textNet($_GET['token'] ?? null);
$mode = $token !== '' ? 'reset' : 'request';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = textNet($_POST['token'] ?? null);
    $mode = $token !== '' ? 'reset' : 'request';

    try {
        $model = new Users();

        if ($mode === 'request') {
            $email = textNet($_POST['email'] ?? null);

            if (!correuValid($email)) {
                $errors[] = 'Introdueix una adreça de correu vàlida.';
            } else {
                $usuari = $model->buscarPerEmail($email);

                // Sempre es mostra el mateix missatge per no revelar quins correus existeixen.
                if ($usuari !== false) {
                    $tokenNou = bin2hex(random_bytes(32));
                    $model->desarTokenRecuperacio((int) $usuari['id'], hash('sha256', $tokenNou));
                    $errorCorreu = enviarCorreuRecuperacio($email, $tokenNou);

                    if ($errorCorreu !== null) {
                        error_log('No s\'ha pogut enviar el correu de recuperació: ' . $errorCorreu);
                    }
                }

                $missatge = 'Si el correu existeix, rebràs un enllaç per restablir la contrasenya.';
            }
        } else {
            $contrasenya = is_string($_POST['password'] ?? null) ? $_POST['password'] : '';
            $contrasenya2 = is_string($_POST['password2'] ?? null) ? $_POST['password2'] : '';

            $usuari = $model->buscarPerTokenRecuperacio($token);

            if ($usuari === false) {
                $errors[] = 'L\'enllaç de recuperació no és vàlid o ha caducat.';
            } else {
                $errorContrasenya = errorContrasenya($contrasenya);
                if ($errorContrasenya !== null) {
                    $errors[] = $errorContrasenya;
                }
                if ($contrasenya !== $contrasenya2) {
                    $errors[] = 'Les contrasenyes no coincideixen.';
                }

                if ($errors === []) {
                    $model->actualitzarContrasenya(
                        (int) $usuari['id'],
                        password_hash($contrasenya, PASSWORD_DEFAULT)
                    );
                    posarFlash('ok', 'Contrasenya actualitzada. Ja pots iniciar sessió.');
                    header('Location: login.php');
                    exit;
                }
            }
        }
    } catch (PDOException $error) {
        error_log('Error en la recuperació: ' . $error->getMessage());
        $errors[] = 'No s\'ha pogut completar la recuperació. Torna-ho a provar més tard.';
    }
}

require __DIR__ . '/../../view/Users/recuperar.php';
