<?php
/**
 * Joan Diaz - Pràctica 04
 * Tanca la sessió, elimina la cookie de recordatori i torna a la portada.
 */
require_once __DIR__ . '/core/auth.php';

iniciarSessio();
tancarSessioUsuari();

header('Location: index.php');
exit;
