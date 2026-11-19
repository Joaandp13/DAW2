<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Fitxa completa d'un build. Mostra tots els camps de la targeta i la
 * descripció (cos). Només l'autor veu les accions d'edició i esborrat.
 */
require_once __DIR__ . '/../../core/auth.php';
require_once __DIR__ . '/../../core/format.php';

// La vista només es carrega des del controlador.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    header('Location: index.php');
    exit;
}

$flash = treureFlash();
$element = (string) ($article['element'] ?? '');
?><!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo htmlspecialchars((string) $article['titol'], ENT_QUOTES, 'UTF-8'); ?> · Archons Posts</title>
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

<main id="main" class="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
    <?php if ($flash !== []): ?>
        <p role="status" class="mb-4 text-sm text-white border border-gold rounded-full px-4 py-2">
            <?php echo htmlspecialchars((string) $flash['missatge'], ENT_QUOTES, 'UTF-8'); ?>
        </p>
    <?php endif; ?>

    <article class="rounded-xl border border-[#323a6b] bg-panel p-5 sm:p-7">
        <h1 class="flex items-center gap-2.5 text-2xl sm:text-3xl">
            <img src="<?php echo htmlspecialchars(iconaElement($element), ENT_QUOTES, 'UTF-8'); ?>"
                 alt="<?php echo htmlspecialchars(nomElement($element), ENT_QUOTES, 'UTF-8'); ?>"
                 class="h-8 w-8 shrink-0">
            <span><?php echo htmlspecialchars((string) $article['titol'], ENT_QUOTES, 'UTF-8'); ?></span>
        </h1>

        <p class="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span class="rounded-full bg-alt px-2.5 py-0.5 text-muted">
                <span class="sr-only">Rol: </span><?php echo htmlspecialchars(etiquetaRol((string) $article['rol']), ENT_QUOTES, 'UTF-8'); ?>
            </span>
            <span class="rounded-full bg-head px-2.5 py-0.5 text-gold">DPS <?php echo htmlspecialchars(formatDps((int) $article['dps']), ENT_QUOTES, 'UTF-8'); ?></span>
            <span class="rounded-full bg-head px-2.5 py-0.5 text-muted">
                Reacció: <?php echo htmlspecialchars((string) $article['reaccio'], ENT_QUOTES, 'UTF-8'); ?>
            </span>
        </p>

        <section aria-labelledby="team-heading" class="mt-6">
            <h2 id="team-heading" class="mb-2 text-sm text-gold">Equip (4 personatges)</h2>
            <ul class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <?php foreach ($article['personatges'] as $index => $personatge): ?>
                    <li class="rounded-lg bg-head p-2.5 text-center text-xs">
                        <img src="<?php echo htmlspecialchars((string) $personatge['imatge'], ENT_QUOTES, 'UTF-8'); ?>"
                             alt="<?php echo htmlspecialchars((string) $personatge['nom'], ENT_QUOTES, 'UTF-8'); ?>"
                             class="mx-auto aspect-square w-full rounded-md object-cover">
                        <p class="mt-2 break-words"><?php echo htmlspecialchars((string) $personatge['nom'], ENT_QUOTES, 'UTF-8'); ?></p>
                        <p class="text-muted">Posició <?php echo $index + 1; ?></p>
                        <p class="text-muted"><?php echo htmlspecialchars(ucfirst((string) $personatge['element']) . ' · ' . (string) $personatge['arma'], ENT_QUOTES, 'UTF-8'); ?></p>
                        <p class="text-gold" aria-label="<?php echo (int) $personatge['rareza']; ?> estrelles">
                            <?php echo str_repeat('★', (int) $personatge['rareza']); ?>
                        </p>
                    </li>
                <?php endforeach; ?>
            </ul>
        </section>

        <section aria-labelledby="description-heading" class="mt-6">
            <h2 id="description-heading" class="mb-2 text-sm text-gold">Descripció del build</h2>
            <p class="whitespace-pre-line text-sm leading-relaxed text-white">
                <?php echo htmlspecialchars((string) $article['cos'], ENT_QUOTES, 'UTF-8'); ?>
            </p>
        </section>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#323a6b] pt-4 text-xs text-muted">
            <p>
                <span class="sr-only">Autor: </span>
                <?php echo htmlspecialchars((string) ($article['username'] ?? 'Usuari eliminat'), ENT_QUOTES, 'UTF-8'); ?>
            </p>
            <p class="flex items-center gap-4">
                <span class="flex items-center gap-1">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
                    <span class="sr-only">Vistes: </span><?php echo (int) $article['vistas']; ?>
                </span>
                <span class="flex items-center gap-1">
                    <span aria-hidden="true" class="block h-4 w-4 bg-gold" style="-webkit-mask: url('img/icons/heart.svg') center / contain no-repeat; mask: url('img/icons/heart.svg') center / contain no-repeat;"></span>
                    <span class="sr-only">Likes: </span><?php echo (int) $article['likes']; ?>
                </span>
            </p>
        </div>

        <?php if ($esPropietari): ?>
            <div class="mt-4 flex items-center gap-3 text-xs">
                <a href="build_form.php?id=<?php echo (int) $article['id']; ?>" class="rounded-full border border-gold px-4 py-1 text-gold hover:bg-gold hover:text-head focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">Edita</a>
                <form method="post" action="index.php" onsubmit="return confirm('Vols esborrar aquest build?');">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="<?php echo (int) $article['id']; ?>">
                    <button type="submit" class="rounded-full border border-[#e08a8a] px-4 py-1 text-[#e08a8a] hover:bg-[#e08a8a] hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e08a8a]">Esborra</button>
                </form>
            </div>
        <?php endif; ?>
    </article>

    <p class="mt-5 text-xs text-muted"><a href="index.php" class="text-gold underline underline-offset-2">&larr; Torna a la llista de builds</a></p>
</main>

<?php require __DIR__ . '/../partials/site-footer.php'; ?>
</body>
</html>
