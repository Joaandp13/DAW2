<?php
/**
 * Joan Diaz - Pràctica 04
 * Barra de navegació: mostra accés/registre als anònims i l'estat de
 * l'usuari (nom i tancament de sessió) als usuaris autenticats.
 */
require_once __DIR__ . '/../../../app/Core/auth.php';

$scriptDirectory = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/'));
$basePath = preg_replace('~/view/(Users|Article)$~', '', rtrim($scriptDirectory, '/'));
$autenticat = usuariAutenticat();
?>
<header class="site-header">
  <nav class="site-nav" aria-label="Navegació principal">
    <a class="site-brand" href="/">NF1</a>
    <div class="site-nav-links">
      <?php if ($autenticat): ?>
        <span class="nav-user"><?php echo htmlspecialchars('Hola, ' . nomUsuariActual(), ENT_QUOTES, 'UTF-8'); ?></span>
        <a class="button" href="/">Els meus articles</a>
        <a class="button button-secondary" href="/logout">Tancar sessió</a>
      <?php else: ?>
        <a class="button button-secondary" href="/login">Iniciar sessió</a>
        <a class="button" href="/register">Registrar-se</a>
      <?php endif; ?>
    </div>
  </nav>
</header>
