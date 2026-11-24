<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Formulari de creació i edició de builds. Demana títol, descripció, reacció,
 * rol, DPS i exactament 4 personatges diferents del catàleg (amb imatge).
 */
require_once __DIR__ . '/../../../app/Core/auth.php';
require_once __DIR__ . '/../../../app/Core/format.php';

// La vista només es carrega des del controlador.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    header('Location: /');
    exit;
}

$flash = treureFlash();

// Valors per defecte: build existent, dades recuperades d'un error o buits.
$valors = [
    'titol'   => '',
    'cos'     => '',
    'reaccio' => '',
    'rol'     => 'main-dps',
    'dps'     => '',
];
$personatgesTriadors = [];

if ($old !== null) {
    $valors = array_merge($valors, $old);
    $personatgesTriadors = array_map('intval', (array) ($old['personatges'] ?? []));
} elseif ($article !== null) {
    $valors = array_merge($valors, [
        'titol'   => (string) $article['titol'],
        'cos'     => (string) $article['cos'],
        'reaccio' => (string) $article['reaccio'],
        'rol'     => (string) $article['rol'],
        'dps'     => (string) $article['dps'],
    ]);
    $personatgesTriadors = array_map(static fn(array $p): int => (int) $p['id'], $article['personatges']);
}

$personatgesTriadors = array_pad(array_slice($personatgesTriadors, 0, 4), 4, 0);
?><!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo $edicio ? 'Edita el build' : 'Nou build'; ?> · Archons Posts</title>
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

<main id="main" class="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
    <?php if ($flash !== []): ?>
        <p role="status" class="mb-4 text-sm text-white border border-gold rounded-full px-4 py-2">
            <?php echo htmlspecialchars((string) $flash['missatge'], ENT_QUOTES, 'UTF-8'); ?>
        </p>
    <?php endif; ?>

    <h1 class="text-2xl sm:text-3xl text-gold"><?php echo $edicio ? 'Edita el build' : 'Nou build'; ?></h1>

    <form method="post" action="/" class="mt-6 rounded-xl border border-[#323a6b] bg-panel p-5 sm:p-7 space-y-5">
        <input type="hidden" name="action" value="<?php echo $edicio ? 'update' : 'insert'; ?>">
        <?php if ($edicio): ?>
            <input type="hidden" name="id" value="<?php echo (int) $id; ?>">
        <?php endif; ?>

        <div>
            <label for="titol" class="block mb-1 text-sm text-gold">Títol</label>
            <input id="titol" name="titol" type="text" maxlength="50" required
                   value="<?php echo htmlspecialchars((string) $valors['titol'], ENT_QUOTES, 'UTF-8'); ?>"
                   class="w-full h-9 rounded-lg bg-field px-3 text-sm text-white placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
        </div>

        <div>
            <label for="cos" class="block mb-1 text-sm text-gold">Descripció del build</label>
            <textarea id="cos" name="cos" rows="6" required
                      class="w-full rounded-lg bg-field px-3 py-2 text-sm text-white placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"><?php echo htmlspecialchars((string) $valors['cos'], ENT_QUOTES, 'UTF-8'); ?></textarea>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
            <div>
                <label for="reaccio" class="block mb-1 text-sm text-gold">Reacció</label>
                <input id="reaccio" name="reaccio" type="text" maxlength="50" required placeholder="HyperBloom..."
                       value="<?php echo htmlspecialchars((string) $valors['reaccio'], ENT_QUOTES, 'UTF-8'); ?>"
                       class="w-full h-9 rounded-lg bg-field px-3 text-sm text-white placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
            </div>
            <div>
                <label for="rol" class="block mb-1 text-sm text-gold">Rol</label>
                <select id="rol" name="rol" required
                        class="w-full h-9 rounded-lg bg-field px-3 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                    <?php foreach (rolsPermesos() as $rol): ?>
                        <option value="<?php echo htmlspecialchars($rol, ENT_QUOTES, 'UTF-8'); ?>" <?php echo $valors['rol'] === $rol ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars(etiquetaRol($rol), ENT_QUOTES, 'UTF-8'); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div>
                <label for="dps" class="block mb-1 text-sm text-gold">DPS (enter)</label>
                <input id="dps" name="dps" type="number" min="0" step="1" required
                       value="<?php echo htmlspecialchars((string) $valors['dps'], ENT_QUOTES, 'UTF-8'); ?>"
                       class="w-full h-9 rounded-lg bg-field px-3 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
            </div>
        </div>

        <fieldset>
            <legend class="mb-2 text-sm text-gold">4 personatges (diferents)</legend>
            <p class="mb-3 text-xs text-muted">Només apareixen els personatges del catàleg que ja tenen imatge. Pots afegir-ne més des de la pantalla d'administració.</p>
            <div class="grid gap-4 sm:grid-cols-2">
                <?php for ($i = 0; $i < 4; $i++): ?>
                    <div>
                        <label for="personatge-<?php echo $i + 1; ?>" class="mb-1 block text-xs text-muted">Personatge <?php echo $i + 1; ?></label>
                        <select id="personatge-<?php echo $i + 1; ?>" name="personatges[]" required
                                class="w-full h-9 rounded-lg bg-field px-3 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                            <option value="">Tria un personatge...</option>
                            <?php foreach ($personatges as $personatge): ?>
                                <option value="<?php echo (int) $personatge['id']; ?>" <?php echo $personatgesTriadors[$i] === (int) $personatge['id'] ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars((string) $personatge['nom'], ENT_QUOTES, 'UTF-8'); ?> · <?php echo htmlspecialchars(ucfirst((string) $personatge['element']) . ' · ' . (string) $personatge['arma'], ENT_QUOTES, 'UTF-8'); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                <?php endfor; ?>
            </div>
        </fieldset>

        <div class="flex flex-wrap items-center gap-3 border-t border-[#323a6b] pt-5">
            <button type="submit" class="rounded-full border border-gold px-5 py-1.5 text-sm text-gold hover:bg-gold hover:text-head focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                <?php echo $edicio ? 'Desa els canvis' : 'Publica el build'; ?>
            </button>
            <a href="<?php echo $edicio ? '/build?id=' . (int) $id : '/'; ?>" class="text-sm text-muted underline underline-offset-2 hover:text-gold">Cancel·la</a>
        </div>
    </form>
</main>

<?php require __DIR__ . '/../partials/site-footer.php'; ?>
</body>
</html>
