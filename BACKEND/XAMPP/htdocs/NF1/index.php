<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Punt d'entrada únic. Les peticions POST es deleguen al controlador
 * d'articles; la resta mostren la llista paginada (pública o de l'usuari).
 */
require_once __DIR__ . '/core/auth.php';

iniciarSessio();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/Controller/Article/article.controller.php';
} else {
    require_once __DIR__ . '/Controller/Article/paginacio.controller.php';
}
