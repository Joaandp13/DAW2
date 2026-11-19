<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Controlador de la fitxa d'un build. Les vistes i els likes són només de
 * lectura: aquesta pàgina no modifica cap comptador.
 */
require_once __DIR__ . '/../../core/auth.php';
require_once __DIR__ . '/../../core/format.php';
require_once __DIR__ . '/../../Model/article.model.php';

iniciarSessio();

$id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if ($id === false) {
    posarFlash('error', 'L\'identificador del build no és vàlid.');
    header('Location: index.php');
    exit;
}

$article = false;
try {
    $article = (new Article())->cercarPerId((int) $id);
} catch (PDOException $error) {
    error_log($error->getMessage());
    posarFlash('error', 'No s\'ha pogut carregar el build.');
}

if ($article === false) {
    posarFlash('error', 'No s\'ha trobat el build.');
    header('Location: index.php');
    exit;
}

$usuariId = idUsuariActual();
$esPropietari = $usuariId !== null && (new Article())->esPropietari((int) $id, $usuariId);

require __DIR__ . '/../../view/Article/build.php';
