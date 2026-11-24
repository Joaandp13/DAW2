<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Controlador de la fitxa d'un build. Incrementa les vistes una vegada per
 * sessió i build; els likes es gestionen des del controlador de likes.
 */
require_once __DIR__ . '/../../../Core/auth.php';
require_once __DIR__ . '/../../../Core/format.php';
require_once __DIR__ . '/../../../Models/article.model.php';

iniciarSessio();

$id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if ($id === false) {
    posarFlash('error', 'L\'identificador del build no és vàlid.');
    header('Location: /');
    exit;
}

$article = false;
$model = new Article();
try {
    $article = $model->cercarPerId((int) $id);
} catch (PDOException $error) {
    error_log($error->getMessage());
    posarFlash('error', 'No s\'ha pogut carregar el build.');
}

if ($article === false) {
    posarFlash('error', 'No s\'ha trobat el build.');
    header('Location: /');
    exit;
}

$idBuild = (int) $id;
if (!isset($_SESSION['vistes_builds']) || !is_array($_SESSION['vistes_builds'])) {
    $_SESSION['vistes_builds'] = [];
}
if (!in_array($idBuild, $_SESSION['vistes_builds'], true)) {
    try {
        $model->incrementarVistes($idBuild);
        $_SESSION['vistes_builds'][] = $idBuild;
        $article['vistas'] = (int) $article['vistas'] + 1;
    } catch (PDOException $error) {
        error_log($error->getMessage());
    }
}

$usuariId = idUsuariActual();
$esPropietari = $usuariId !== null && $model->esPropietari($idBuild, $usuariId);
$haDonatLike = $usuariId !== null && $model->usuariHaDonatLike($idBuild, $usuariId);

require __DIR__ . '/../../../../resources/views/Article/build.php';
