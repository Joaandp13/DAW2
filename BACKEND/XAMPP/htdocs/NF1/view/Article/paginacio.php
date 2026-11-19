<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Portada: llista de builds amb banners i esdeveniments laterals, filtres
 * funcionals i paginació de 5 en 5. Adaptada d'accessible/index.html.
 * L'usuari anònim només llegeix; l'usuari autenticat veu i edita els seus.
 */
require_once __DIR__ . '/../../core/auth.php';
require_once __DIR__ . '/../../core/format.php';

// La vista només es carrega des del controlador.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    header('Location: index.php');
    exit;
}

$flash = treureFlash();

/** Enllaç a una pàgina de la paginació conservant els filtres actius. */
$urlPagina = static function (int $numero) use ($queryBase): string {
    return 'index.php?' . ($queryBase !== '' ? $queryBase . '&' : '') . 'page=' . $numero;
};
?>
<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Archons Posts</title>
    <link rel="icon" href="img/icons/alien-icon.svg" type="image/svg+xml">
    <link href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Orbitron:wght@400;500&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="view/styles/accessibility.css">
    <script>
        tailwind.config = {
            theme: { extend: {
                colors: {
                    bg: "#10152A", panel: "#262D52", alt: "#323A6E", head: "#1A2040",
                    field: "#343C73", gold: "#EBB74A", muted: "#A7B0DC", amber: "#8A5B25", pill: "#D3D4DA"
                },
                fontFamily: { main: ["Lilita One", "sans-serif"], logo: ["Orbitron", "sans-serif"] }
            } }
        }
    </script>
</head>
<body class="min-h-screen flex flex-col bg-bg text-white font-main">

<a href="#main" class="skip-link">Vés al contingut principal</a>

<?php require __DIR__ . '/../partials/site-header.php'; ?>

<main id="main" class="flex-1 grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)_180px] xl:grid-cols-[240px_minmax(0,860px)_240px] justify-center items-start gap-7 xl:gap-8 px-4 xl:px-5 pt-8 pb-20">

    <h1 class="sr-only">Archons Posts — base de dades de builds</h1>

    <!-- Banners laterals (assets estàtics) -->
    <aside aria-label="Current banners" class="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-7 lg:pt-16">
        <h2 class="col-span-full text-sm text-gold lg:-mb-2">Current Banners</h2>
        <div class="aspect-[130/72] overflow-hidden rounded-sm bg-gradient-to-br from-[#2c3468] to-[#4a3a2a]">
            <img src="img/banners/banner-1.png" alt="Current banner 1 of 3" class="w-full h-full object-cover">
        </div>
        <div class="aspect-[130/72] overflow-hidden rounded-sm bg-gradient-to-br from-[#2c3468] to-[#4a3a2a]">
            <img src="img/banners/banner-2.png" alt="Current banner 2 of 3" class="w-full h-full object-cover">
        </div>
        <div class="aspect-[130/72] overflow-hidden rounded-sm bg-gradient-to-br from-[#2c3468] to-[#4a3a2a]">
            <img src="img/banners/banner-3.png" alt="Current banner 3 of 3" class="w-full h-full object-cover">
        </div>
    </aside>

    <!-- Columna central -->
    <section aria-labelledby="builds-heading" class="min-w-0">
        <h2 id="builds-heading" class="sr-only">Builds database</h2>

        <?php if ($esAutenticat): ?>
            <div class="mb-3 flex items-center justify-end gap-3 text-xs text-gold">
                <span><?php echo htmlspecialchars('Els teus builds · ' . nomUsuariActual(), ENT_QUOTES, 'UTF-8'); ?></span>
                <a href="build_form.php" class="rounded-full border border-gold px-4 py-1 hover:bg-gold hover:text-head focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">Nou build</a>
            </div>
        <?php endif; ?>

        <?php if ($flash !== []): ?>
            <p role="status" class="mb-4 text-sm text-white border border-gold rounded-full px-4 py-2">
                <?php echo htmlspecialchars((string) $flash['missatge'], ENT_QUOTES, 'UTF-8'); ?>
            </p>
        <?php endif; ?>

        <!-- Filtres funcionals (GET: conserven la paginació) -->
        <form action="index.php" method="get" aria-label="Search builds" class="mb-4">
            <fieldset class="grid w-full min-w-0 grid-cols-2 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,.8fr)] gap-3.5">
                <legend class="sr-only">Filtra els builds per títol, autor, reacció, rol i ordre</legend>

                <div>
                    <label for="f-title" class="block mb-0.5 text-xs text-gold">Title</label>
                    <div class="flex items-center h-7 px-3 rounded-full bg-pill text-[#2a2e4a] focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 focus-within:ring-offset-bg">
                        <input id="f-title" name="titol" type="text" placeholder="Lohen Melt..."
                               value="<?php echo htmlspecialchars($filtres['titol'], ENT_QUOTES, 'UTF-8'); ?>"
                               class="flex-1 min-w-0 text-xs text-[#2a2e4a] bg-transparent placeholder:text-[#3b4166] focus:outline-none">
                        <button type="submit" aria-label="Search builds" class="focus-dark ml-2 shrink-0 rounded-sm">
                            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M16 16l5 5"/></svg>
                        </button>
                    </div>
                </div>

                <div>
                    <label for="f-author" class="block mb-0.5 text-xs text-gold">Author</label>
                    <div class="flex items-center h-7 px-3 rounded-full bg-pill text-[#2a2e4a] focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 focus-within:ring-offset-bg">
                        <input id="f-author" name="autor" type="text" placeholder="TravelerPaimon..."
                               value="<?php echo htmlspecialchars($filtres['autor'], ENT_QUOTES, 'UTF-8'); ?>"
                               class="flex-1 min-w-0 text-xs text-[#2a2e4a] bg-transparent placeholder:text-[#3b4166] focus:outline-none">
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M16 16l5 5"/></svg>
                    </div>
                </div>

                <div>
                    <label for="f-reaction" class="block mb-0.5 text-xs text-gold">Reaction</label>
                    <div class="flex items-center h-7 px-3 rounded-full bg-pill text-[#2a2e4a] focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 focus-within:ring-offset-bg">
                        <input id="f-reaction" name="reaccio" type="text" placeholder="HyperBloom..."
                               value="<?php echo htmlspecialchars($filtres['reaccio'], ENT_QUOTES, 'UTF-8'); ?>"
                               class="flex-1 min-w-0 text-xs text-[#2a2e4a] bg-transparent placeholder:text-[#3b4166] focus:outline-none">
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M16 16l5 5"/></svg>
                    </div>
                </div>

                <div>
                    <label for="f-role" class="block mb-0.5 text-xs text-gold">Role</label>
                    <div class="relative">
                        <select id="f-role" name="rol" class="w-full h-7 appearance-none pl-3 pr-7 text-xs rounded-full bg-pill text-[#2a2e4a] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
                            <option value="" <?php echo $filtres['rol'] === '' ? 'selected' : ''; ?>>All roles</option>
                            <option value="main-dps" <?php echo $filtres['rol'] === 'main-dps' ? 'selected' : ''; ?>>Main DPS</option>
                            <option value="sub-dps" <?php echo $filtres['rol'] === 'sub-dps' ? 'selected' : ''; ?>>Sub DPS</option>
                            <option value="support" <?php echo $filtres['rol'] === 'support' ? 'selected' : ''; ?>>Support</option>
                        </select>
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#2a2e4a]" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                </div>

                <div>
                    <label for="f-order" class="block mb-0.5 text-xs text-gold">Order</label>
                    <div class="relative">
                        <select id="f-order" name="order" class="w-full h-7 appearance-none pl-3 pr-7 text-xs rounded-full bg-pill text-[#2a2e4a] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
                            <option value="likes" <?php echo $filtres['order'] === 'likes' ? 'selected' : ''; ?>>Likes ↑</option>
                            <option value="views" <?php echo $filtres['order'] === 'views' ? 'selected' : ''; ?>>Views</option>
                            <option value="recent" <?php echo $filtres['order'] === 'recent' ? 'selected' : ''; ?>>Most recent</option>
                        </select>
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#2a2e4a]" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                </div>
            </fieldset>
        </form>

        <ul class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5" aria-label="List of published builds">
            <?php if ($articles === []): ?>
                <li class="col-span-full rounded-xl border border-[#323a6b] bg-panel p-6 text-center text-muted">
                    Encara no hi ha builds que compleixin els filtres.
                    <?php if ($esAutenticat): ?>Crea'n un amb «Nou build».<?php endif; ?>
                </li>
            <?php endif; ?>

            <?php foreach ($articles as $article): ?>
                <?php $element = (string) ($article['element'] ?? ''); ?>
                <li>
                    <article class="relative flex h-full flex-col gap-3 rounded-xl border border-[#323a6b] bg-panel p-3.5 focus-within:ring-2 focus-within:ring-gold hover:brightness-110">
                        <h3 class="flex items-center gap-2 text-base">
                            <img src="<?php echo htmlspecialchars(iconaElement($element), ENT_QUOTES, 'UTF-8'); ?>"
                                 alt="<?php echo htmlspecialchars(nomElement($element), ENT_QUOTES, 'UTF-8'); ?>"
                                 class="h-[22px] w-[22px] shrink-0">
                            <a href="build.php?id=<?php echo (int) $article['id']; ?>"
                               class="after:absolute after:inset-0 after:rounded-xl hover:underline focus:outline-none">
                                <?php echo htmlspecialchars((string) $article['titol'], ENT_QUOTES, 'UTF-8'); ?>
                            </a>
                        </h3>

                        <!-- Els 4 personatges del build, amb el nom com a alt -->
                        <div class="grid grid-cols-4 gap-2 rounded-lg bg-head p-2.5">
                            <?php foreach ($article['personatges'] as $personatge): ?>
                                <img src="<?php echo htmlspecialchars((string) $personatge['imatge'], ENT_QUOTES, 'UTF-8'); ?>"
                                     alt="<?php echo htmlspecialchars((string) $personatge['nom'], ENT_QUOTES, 'UTF-8'); ?>"
                                     class="aspect-square w-full rounded-md object-cover">
                            <?php endforeach; ?>
                        </div>

                        <p class="flex flex-wrap items-center gap-2 text-[11px]">
                            <span class="rounded-full bg-alt px-2.5 py-0.5 text-muted"><span class="sr-only">Role: </span><?php echo htmlspecialchars(etiquetaRol((string) $article['rol']), ENT_QUOTES, 'UTF-8'); ?></span>
                            <span class="rounded-full bg-head px-2.5 py-0.5 text-gold">DPS <?php echo htmlspecialchars(formatDps((int) $article['dps']), ENT_QUOTES, 'UTF-8'); ?></span>
                            <span class="rounded-full bg-head px-2.5 py-0.5 text-muted"><?php echo htmlspecialchars((string) $article['reaccio'], ENT_QUOTES, 'UTF-8'); ?></span>
                        </p>

                        <div class="mt-auto flex items-center justify-between gap-2 text-xs text-muted">
                            <p class="flex min-w-0 items-center gap-2">
                                <span aria-hidden="true" class="h-4 w-4 shrink-0 rounded-full bg-[#7a83b5]"></span>
                                <span class="truncate"><span class="sr-only">Author: </span><?php echo htmlspecialchars((string) ($article['username'] ?? 'Usuari eliminat'), ENT_QUOTES, 'UTF-8'); ?></span>
                            </p>
                            <p class="flex shrink-0 items-center gap-3">
                                <span class="flex items-center gap-1">
                                    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
                                    <span class="sr-only">Views: </span><?php echo (int) $article['vistas']; ?>
                                </span>
                                <span class="flex items-center gap-1">
                                    <span aria-hidden="true" class="block h-3.5 w-3.5 bg-gold" style="-webkit-mask: url('img/icons/heart.svg') center / contain no-repeat; mask: url('img/icons/heart.svg') center / contain no-repeat;"></span>
                                    <span class="sr-only">Likes: </span><?php echo (int) $article['likes']; ?>
                                </span>
                            </p>
                        </div>

                        <?php if ($esAutenticat): ?>
                            <!-- Només apareixen les accions dels builds propis -->
                            <div class="relative z-10 flex items-center gap-3 border-t border-[#323a6b] pt-2 text-xs">
                                <a href="build_form.php?id=<?php echo (int) $article['id']; ?>" class="text-gold underline underline-offset-2">Edita</a>
                                <form method="post" action="index.php" onsubmit="return confirm('Vols esborrar aquest build?');">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?php echo (int) $article['id']; ?>">
                                    <button type="submit" class="text-[#e08a8a] underline underline-offset-2">Esborra</button>
                                </form>
                            </div>
                        <?php endif; ?>
                    </article>
                </li>
            <?php endforeach; ?>
        </ul>

        <!-- Paginació de 5 en 5 (en lloc del «Load more» del disseny) -->
        <nav aria-label="Paginació de builds" class="mt-6 flex items-center justify-center gap-3 text-xs text-gold">
            <?php if ($pagina > 1): ?>
                <a href="<?php echo htmlspecialchars($urlPagina($pagina - 1), ENT_QUOTES, 'UTF-8'); ?>" class="rounded-full border border-gold px-4 py-1 hover:bg-gold hover:text-head focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">Anterior</a>
            <?php else: ?>
                <span class="rounded-full border border-gold px-4 py-1 opacity-50">Anterior</span>
            <?php endif; ?>

            <span class="text-muted">Pàgina <?php echo $pagina; ?> de <?php echo $total_pagines; ?></span>

            <?php if ($pagina < $total_pagines): ?>
                <a href="<?php echo htmlspecialchars($urlPagina($pagina + 1), ENT_QUOTES, 'UTF-8'); ?>" class="rounded-full border border-gold px-4 py-1 hover:bg-gold hover:text-head focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">Següent</a>
            <?php else: ?>
                <span class="rounded-full border border-gold px-4 py-1 opacity-50">Següent</span>
            <?php endif; ?>
        </nav>
    </section>

    <!-- Esdeveniments laterals (assets estàtics) -->
    <aside aria-label="Active events" class="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-7 lg:pt-16">
        <h2 class="col-span-full text-sm text-gold lg:-mb-2">Active Events</h2>
        <div class="aspect-[130/72] overflow-hidden rounded-sm bg-gradient-to-br from-[#2c3468] to-[#4a3a2a]">
            <img src="img/events/event-1.png" alt="Active event 1 of 3" class="w-full h-full object-cover">
        </div>
        <div class="aspect-[130/72] overflow-hidden rounded-sm bg-gradient-to-br from-[#2c3468] to-[#4a3a2a]">
            <img src="img/events/event-2.png" alt="Active event 2 of 3" class="w-full h-full object-cover">
        </div>
        <div class="aspect-[130/72] overflow-hidden rounded-sm bg-gradient-to-br from-[#2c3468] to-[#4a3a2a]">
            <img src="img/events/event-3.png" alt="Active event 3 of 3" class="w-full h-full object-cover">
        </div>
    </aside>
</main>

<?php require __DIR__ . '/../partials/site-footer.php'; ?>
</body>
</html>
