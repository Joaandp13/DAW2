<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Controlador del formulari d'accés. Comprova l'usuari contra la BDD,
 * verifica la contrasenya encriptada i obre la sessió.
 */
require_once __DIR__ . '/../../core/auth.php';
require_once __DIR__ . '/../../core/validacio.php';
require_once __DIR__ . '/../../Model/users.model.php';

iniciarSessio();

// Un usuari ja autenticat no necessita tornar a iniciar sessió.
if (usuariAutenticat()) {
    header('Location: index.php');
    exit;
}

$errors = [];
$usuari = '';
$recordar = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuari = textNet($_POST['user'] ?? null);
    $contrasenya = is_string($_POST['pass'] ?? null) ? $_POST['pass'] : '';
    $recordar = isset($_POST['remember']) && $_POST['remember'] === '1';

    if ($usuari === '' || $contrasenya === '') {
        $errors[] = 'Has d\'introduir el nom d\'usuari o correu i la contrasenya.';
    } else {
        try {
            $usuariTrobat = (new Users())->buscarPerIdentificador($usuari);

            // Missatge genèric per no revelar si el correu existeix o no.
            if ($usuariTrobat === false || !password_verify($contrasenya, (string) $usuariTrobat['password'])) {
                $errors[] = 'El nom d\'usuari o la contrasenya no són correctes.';
            } else {
                iniciarSessioUsuari(
                    (int) $usuariTrobat['id'],
                    (string) $usuariTrobat['username'],
                    (int) $usuariTrobat['admin'],
                    $recordar
                );
                posarFlash('ok', 'Sessió iniciada correctament. Benvingut/da, ' . $usuariTrobat['username'] . '.');
                header('Location: index.php');
                exit;
            }
        } catch (PDOException $error) {
            error_log('Error en iniciar sessió: ' . $error->getMessage());
            $errors[] = 'No s\'ha pogut comprovar l\'usuari. Torna-ho a provar més tard.';
        }
    }
}

require __DIR__ . '/../../view/Users/login.php';
