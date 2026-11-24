<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Pantalla d'administració del catàleg de personatges. Només accessible per
 * usuaris amb admin = 1. Les dades del formulari es reenvien al controlador.
 */
require_once __DIR__ . '/../../../app/Core/auth.php';
require_once __DIR__ . '/../../../app/Core/format.php';

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    header('Location: /');
    exit;
}

$flash = treureFlash();

// Personatge en edició (si s'ha fet clic a «Edita») o formulari buit.
$editant = null;
foreach ($personatges as $personatge) {
    if ((int) $personatge['id'] === $idEditar) {
        $editant = $personatge;
        break;
    }
}

$valors = [
    'id_externo' => '',
    'nom'        => '',
    'imatge'     => '',
    'element'    => 'anemo',
    'rareza'     => '5',
    'arma'       => 'Sword',
];

if ($editant !== null) {
    foreach ($valors as $clau => $_) {
        $valors[$clau] = (string) $editant[$clau];
    }
}
?><!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Catàleg de personatges · Archons Posts</title>
    <link rel="icon" href="/img/icons/alien-icon.svg" type="image/svg+xml">
    <link href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Orbitron:wght@400;500&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/css/accessibility.css">
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

<main id="main" class="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
    <?php if ($flash !== []): ?>
        <p role="status" class="mb-4 text-sm text-white border border-gold rounded-full px-4 py-2">
            <?php echo htmlspecialchars((string) $flash['missatge'], ENT_QUOTES, 'UTF-8'); ?>
        </p>
    <?php endif; ?>

    <h1 class="text-2xl sm:text-3xl text-gold">Catàleg de personatges</h1>
    <p class="mt-1 text-sm text-muted">Afegeix la ruta de la imatge a cada personatge perquè es pugui fer servir en un build.</p>

    <div class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="catalog-heading" class="min-w-0">
            <h2 id="catalog-heading" class="sr-only">Llista de personatges</h2>
            <div class="overflow-x-auto rounded-xl border border-[#323a6b]">
                <table class="w-full text-left text-xs">
                    <caption class="sr-only">Personatges del catàleg amb la seva imatge, element, rareza i arma</caption>
                    <thead class="bg-head text-gold">
                        <tr>
                            <th scope="col" class="px-3 py-2">Imatge</th>
                            <th scope="col" class="px-3 py-2">Nom / id extern</th>
                            <th scope="col" class="px-3 py-2">Element</th>
                            <th scope="col" class="px-3 py-2">Rareza</th>
                            <th scope="col" class="px-3 py-2">Arma</th>
                            <th scope="col" class="px-3 py-2">Accions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($personatges === []): ?>
                            <tr><td colspan="6" class="px-3 py-6 text-center text-muted">El catàleg encara està buit. Afegeix el primer personatge amb el formulari.</td></tr>
                        <?php endif; ?>
                        <?php foreach ($personatges as $personatge): ?>
                            <tr class="border-t border-[#323a6b]">
                                <td class="px-3 py-2">
                                    <?php if (trim((string) $personatge['imatge']) !== ''): ?>
                                        <img src="<?php echo htmlspecialchars((string) $personatge['imatge'], ENT_QUOTES, 'UTF-8'); ?>"
                                             alt="<?php echo htmlspecialchars((string) $personatge['nom'], ENT_QUOTES, 'UTF-8'); ?>"
                                             class="h-10 w-10 rounded-md object-cover">
                                    <?php else: ?>
                                        <span class="block h-10 w-10 rounded-md bg-alt" title="Sense imatge"></span>
                                        <span class="sr-only">Sense imatge</span>
                                    <?php endif; ?>
                                </td>
                                <td class="px-3 py-2">
                                    <strong class="font-normal text-white"><?php echo htmlspecialchars((string) $personatge['nom'], ENT_QUOTES, 'UTF-8'); ?></strong><br>
                                    <span class="text-muted"><?php echo htmlspecialchars((string) $personatge['id_externo'], ENT_QUOTES, 'UTF-8'); ?></span>
                                </td>
                                <td class="px-3 py-2 text-muted"><?php echo htmlspecialchars(ucfirst((string) $personatge['element']), ENT_QUOTES, 'UTF-8'); ?></td>
                                <td class="px-3 py-2 text-gold"><span class="sr-only"><?php echo (int) $personatge['rareza']; ?> estrelles</span><?php echo str_repeat('★', (int) $personatge['rareza']); ?></td>
                                <td class="px-3 py-2 text-muted"><?php echo htmlspecialchars((string) $personatge['arma'], ENT_QUOTES, 'UTF-8'); ?></td>
                                <td class="px-3 py-2">
                                    <div class="flex items-center gap-3">
                                        <a href="/personatges?edit=<?php echo (int) $personatge['id']; ?>" class="text-gold underline underline-offset-2">Edita</a>
                                        <form method="post" action="/personatges" onsubmit="return confirm('Vols esborrar aquest personatge del catàleg?');">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo (int) $personatge['id']; ?>">
                                            <button type="submit" class="text-[#e08a8a] underline underline-offset-2">Esborra</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="form-heading" class="rounded-xl border border-[#323a6b] bg-panel p-5">
            <h2 id="form-heading" class="text-base text-gold"><?php echo $editant !== null ? 'Edita el personatge' : 'Afegeix un personatge'; ?></h2>
            <form method="post" action="/personatges" enctype="multipart/form-data" class="mt-4 space-y-3 text-sm">
                <input type="hidden" name="action" value="<?php echo $editant !== null ? 'update' : 'insert'; ?>">
                <?php if ($editant !== null): ?>
                    <input type="hidden" name="id" value="<?php echo (int) $editant['id']; ?>">
                <?php endif; ?>

                <div>
                    <label for="id_externo" class="mb-1 block text-xs text-gold">Id extern (slug)</label>
                    <input id="id_externo" name="id_externo" type="text" required maxlength="50" pattern="[a-z0-9]+(_[a-z0-9]+)*" placeholder="raiden_shogun"
                           value="<?php echo htmlspecialchars($valors['id_externo'], ENT_QUOTES, 'UTF-8'); ?>"
                           class="w-full h-9 rounded-lg bg-field px-3 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                </div>
                <div>
                    <label for="nom" class="mb-1 block text-xs text-gold">Nom</label>
                    <input id="nom" name="nom" type="text" required maxlength="100" placeholder="Raiden Shogun"
                           value="<?php echo htmlspecialchars($valors['nom'], ENT_QUOTES, 'UTF-8'); ?>"
                           class="w-full h-9 rounded-lg bg-field px-3 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                </div>
                <div>
                    <label for="imatge" class="mb-1 block text-xs text-gold">Ruta de la imatge</label>
                    <input id="imatge" name="imatge" type="text" maxlength="255" placeholder="img/personatges/raiden_shogun.png"
                           value="<?php echo htmlspecialchars($valors['imatge'], ENT_QUOTES, 'UTF-8'); ?>"
                           class="w-full h-9 rounded-lg bg-field px-3 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                    <p id="imatge-ajuda" class="mt-1 text-[11px] text-muted">Ruta relativa des de l'arrel de NF1. Sense imatge no es pot publicar el build.</p>
                </div>

                <div>
                    <label for="imatge_file" class="mb-1 block text-xs text-gold">O examina els fitxers</label>
                    <input id="imatge_file" name="imatge_file" type="file" accept="image/png,image/webp"
                           aria-describedby="imatge-file-ajuda"
                           class="block w-full text-xs text-muted file:mr-3 file:rounded-full file:border file:border-gold file:bg-transparent file:px-3 file:py-1 file:text-gold file:hover:bg-gold file:hover:text-head focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                    <p id="imatge-file-ajuda" class="mt-1 text-[11px] text-muted">Només PNG o WebP, màxim 2 MB. Es desa a <code>img/personatges/&lt;id_extern&gt;.ext</code>. Si hi ha un fitxer triat, s'ignora la ruta escrita a mà.</p>
                </div>

                <?php if ($editant !== null && trim((string) $editant['imatge']) !== ''): ?>
                    <div>
                        <p class="mb-1 text-xs text-gold">Imatge actual</p>
                        <img src="<?php echo htmlspecialchars((string) $editant['imatge'], ENT_QUOTES, 'UTF-8'); ?>"
                             alt="Retrat actual de <?php echo htmlspecialchars((string) $editant['nom'], ENT_QUOTES, 'UTF-8'); ?>"
                             class="h-16 w-16 rounded-md object-cover">
                    </div>
                <?php endif; ?>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label for="element" class="mb-1 block text-xs text-gold">Element</label>
                        <select id="element" name="element" required class="w-full h-9 rounded-lg bg-field px-3 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                            <?php foreach (elementsPermesos() as $element): ?>
                                <option value="<?php echo $element; ?>" <?php echo $valors['element'] === $element ? 'selected' : ''; ?>><?php echo nomElement($element); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div>
                        <label for="rareza" class="mb-1 block text-xs text-gold">Rareza</label>
                        <input id="rareza" name="rareza" type="number" min="1" max="99" step="1" required
                               value="<?php echo htmlspecialchars($valors['rareza'], ENT_QUOTES, 'UTF-8'); ?>"
                               class="w-full h-9 rounded-lg bg-field px-3 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                    </div>
                </div>
                <div>
                    <label for="arma" class="mb-1 block text-xs text-gold">Arma</label>
                    <select id="arma" name="arma" required class="w-full h-9 rounded-lg bg-field px-3 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                        <?php foreach (armesPermeses() as $arma): ?>
                            <option value="<?php echo $arma; ?>" <?php echo $valors['arma'] === $arma ? 'selected' : ''; ?>><?php echo $arma; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="flex items-center gap-3 border-t border-[#323a6b] pt-3">
                    <button type="submit" class="rounded-full border border-gold px-4 py-1 text-xs text-gold hover:bg-gold hover:text-head focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                        <?php echo $editant !== null ? 'Desa els canvis' : 'Afegeix al catàleg'; ?>
                    </button>
                    <?php if ($editant !== null): ?>
                        <a href="/personatges" class="text-xs text-muted underline underline-offset-2">Cancel·la</a>
                    <?php endif; ?>
                </div>
            </form>
        </section>
    </div>
</main>

<?php require __DIR__ . '/../partials/site-footer.php'; ?>
</body>
</html>
