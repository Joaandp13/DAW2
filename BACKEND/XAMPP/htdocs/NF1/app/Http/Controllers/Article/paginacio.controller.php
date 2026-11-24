<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Controlador de la portada. Aplica els filtres del formulari, prepara la
 * paginació (5 builds per pàgina) i decideix quines dades rep la vista:
 *  - anònim: tots els builds, només lectura;
 *  - autenticat: només els seus builds, amb opcions d'edició.
 */
require_once __DIR__ . '/../../../Core/auth.php';
require_once __DIR__ . '/../../../Core/validacio.php';
require_once __DIR__ . '/../../../Core/format.php';
require_once __DIR__ . '/../../../Models/article.model.php';

iniciarSessio();

$art_ppagina = 5;
$pagina = 1;
$usuariId = idUsuariActual();
$esAutenticat = $usuariId !== null;

// Filtres: només s'accepten valors coneguts per evitar consultes arbitràries.
$rolFiltre = textNet($_GET['rol'] ?? null);
$orderFiltre = textNet($_GET['order'] ?? null);

$filtres = [
    'titol'   => textNet($_GET['titol'] ?? null),
    'autor'   => textNet($_GET['autor'] ?? null),
    'reaccio' => textNet($_GET['reaccio'] ?? null),
    'rol'     => in_array($rolFiltre, rolsPermesos(), true) ? $rolFiltre : '',
    'order'   => in_array($orderFiltre, ['likes', 'views', 'recent'], true) ? $orderFiltre : 'likes',
];

if (isset($_GET['page']) && is_string($_GET['page'])) {
    $valor = filter_var($_GET['page'], FILTER_VALIDATE_INT);
    if ($valor !== false && $valor >= 1) {
        $pagina = $valor;
    }
}

// La query base conserva els filtres en enllaçar a la pàgina següent.
$queryBase = http_build_query(array_filter(
    $filtres,
    static fn(string $valor): bool => $valor !== ''
));

$articles = [];
$total_pagines = 1;
$likedArticleIds = [];

try {
    $model = new Article();
    $total = $model->comptarArticles($filtres, $esAutenticat ? $usuariId : null);

    $total_pagines = max(1, (int) ceil($total / $art_ppagina));
    if ($pagina > $total_pagines) {
        $pagina = $total_pagines;
    }

    $offset = ($pagina - 1) * $art_ppagina;
    $articles = $model->returnPage($art_ppagina, $offset, $filtres, $esAutenticat ? $usuariId : null);
    if ($esAutenticat && $articles !== []) {
        $likedArticleIds = $model->idsLikedPerUsuari(array_column($articles, 'id'), (int) $usuariId);
    }
} catch (PDOException $error) {
    error_log($error->getMessage());
    posarFlash('error', 'No s\'han pogut carregar els builds.');
}

require __DIR__ . '/../../../../resources/views/Article/paginacio.php';
