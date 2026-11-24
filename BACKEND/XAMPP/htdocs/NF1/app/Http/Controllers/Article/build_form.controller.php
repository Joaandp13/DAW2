<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Controlador del formulari de creació i edició de builds.
 * Només es pot editar un build propi. Les opcions de personatge són les del
 * catàleg que ja tenen imatge, perquè no es permet publicar recuadres buits.
 */
require_once __DIR__ . '/../../../Core/auth.php';
require_once __DIR__ . '/../../../Core/format.php';
require_once __DIR__ . '/../../../Models/article.model.php';
require_once __DIR__ . '/../../../Models/personatge.model.php';

iniciarSessio();

$usuariId = idUsuariActual();
if ($usuariId === null) {
    posarFlash('error', 'Has d\'iniciar sessió per gestionar builds.');
    header('Location: /login');
    exit;
}

$edicio = false;
$article = null;
$id = 0;

if (isset($_GET['id'])) {
    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($id === false) {
        posarFlash('error', 'L\'identificador del build no és vàlid.');
        header('Location: /');
        exit;
    }

    $model = new Article();
    $article = $model->cercarPerId((int) $id);
    if ($article === false || !$model->esPropietari((int) $id, $usuariId)) {
        posarFlash('error', 'No s\'ha trobat el build o no ets el seu autor.');
        header('Location: /');
        exit;
    }
    $edicio = true;
}

// Dades recuperades després d'un error de validació (PRG amb flash).
$old = $_SESSION['build_old'] ?? null;
unset($_SESSION['build_old']);

$personatges = (new Personatge())->llistarSeleccionables();

require __DIR__ . '/../../../../resources/views/Article/formBuild.php';
