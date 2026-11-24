<?php
/**
 * Tanca la sessió, elimina la cookie de recordatori i torna a la portada.
 */
require_once __DIR__ . '/../../../Core/auth.php';

iniciarSessio();
tancarSessioUsuari();

header('Location: /');
exit;
