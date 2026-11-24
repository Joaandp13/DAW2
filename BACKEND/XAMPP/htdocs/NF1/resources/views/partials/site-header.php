<?php
/**
 * Joan Diaz - Pràctica 04
 * Capçalera compartida per les pàgines de builds, adaptada del disseny
 * accessible/index.html. Els dos <nav> tenen aria-label diferent.
 */
require_once __DIR__ . '/../../../app/Core/auth.php';

$autenticat = usuariAutenticat();
?>
<header class="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-3 bg-panel font-logo text-gold">
    <a href="/" aria-label="Archons Posts — Inici" class="flex items-center gap-2.5 justify-self-start">
        <span aria-hidden="true" class="block w-[26px] h-[29px] bg-gold" style="-webkit-mask: url('/img/icons/alien-icon.svg') center / contain no-repeat; mask: url('/img/icons/alien-icon.svg') center / contain no-repeat;"></span>
        <span class="text-lg tracking-wider hidden sm:inline">ARCHONS POSTS</span>
    </a>

    <nav aria-label="Secondary navigation" class="justify-self-center text-sm">
        <a href="newsletter.html" class="hover:underline">Newsletter</a>
    </nav>

    <nav aria-label="Main navigation" class="justify-self-end text-sm flex items-center gap-2">
        <?php if ($autenticat): ?>
            <span class="text-white hidden sm:inline"><?php echo htmlspecialchars('Hola, ' . nomUsuariActual(), ENT_QUOTES, 'UTF-8'); ?></span>
            <?php if (esAdminActual()): ?>
                <a href="/personatges" class="hover:underline">Personatges</a>
            <?php endif; ?>
            <a href="/logout" class="hover:underline">Logout</a>
        <?php else: ?>
            <a href="/login" class="hover:underline">Login</a> or <a href="/register" class="hover:underline">Register</a>
        <?php endif; ?>
    </nav>
</header>
