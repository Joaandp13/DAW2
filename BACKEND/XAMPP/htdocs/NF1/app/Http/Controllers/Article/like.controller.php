<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Controlador de likes dels builds. Toggle persistent per usuari autenticat.
 * Accepta només POST i redirigeix a la pàgina d'origen.
 */
require_once __DIR__ . '/../../../Core/auth.php';
require_once __DIR__ . '/../../../Models/article.model.php';

iniciarSessio();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /');
    exit;
}

$id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if ($id === false) {
    posarFlash('error', 'L\'identificador del build no és vàlid.');
    header('Location: /');
    exit;
}

$idBuild = (int) $id;
$retorn = (string) ($_POST['return'] ?? '');
$destinsPermesos = ['/', '/build'];
$destPath = parse_url($retorn, PHP_URL_PATH) ?: '';
$destPath = '/' . trim($destPath, '/');
if ($destPath !== '/') {
    $destPath = rtrim($destPath, '/');
}
if ($retorn === '' || !in_array($destPath, $destinsPermesos, true) || preg_match('/^[a-zA-Z0-9_\.\-?=&%#\/]+$/', $retorn) !== 1) {
    $retorn = '/build?id=' . $idBuild;
}

$usuariId = idUsuariActual();
if ($usuariId === null) {
    posarFlash('error', 'Has d\'iniciar sessió per donar like als builds.');
    header('Location: /login');
    exit;
}

try {
    $model = new Article();
    $article = $model->cercarPerId($idBuild);
    if ($article === false) {
        posarFlash('error', 'No s\'ha trobat el build.');
        header('Location: /');
        exit;
    }

    $model->toggleLike($idBuild, $usuariId);
} catch (PDOException $error) {
    error_log($error->getMessage());
    posarFlash('error', 'No s\'ha pogut actualitzar el like.');
}

header('Location: ' . $retorn);
exit;