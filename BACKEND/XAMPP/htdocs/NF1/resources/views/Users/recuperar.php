<?php
/**
 * Joan Diaz - Pràctica 04
 * Vista per demanar i confirmar el restabliment de la contrasenya.
 */
require_once __DIR__ . '/../../../app/Core/auth.php';

// La vista només es carrega des del controlador.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    header('Location: /recuperar');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Recuperar contrasenya · Archons Posts</title>
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
<body class="bg-bg text-white font-main min-h-screen flex flex-col items-center justify-center gap-6 p-6">

<a href="#main" class="skip-link">Vés al contingut principal</a>

<header>
    <a href="/" aria-label="Archons Posts — Inici" class="flex items-center gap-3 text-gold">
        <span aria-hidden="true" class="block w-8 h-9 bg-gold" style="-webkit-mask: url('/img/icons/alien-icon.svg') center / contain no-repeat; mask: url('/img/icons/alien-icon.svg') center / contain no-repeat;"></span>
        <span class="font-logo text-2xl tracking-wider">ARCHONS POSTS</span>
    </a>
</header>

<main id="main" class="w-full max-w-xl bg-panel border border-[#323a6b] rounded-lg p-10 shadow-2xl shadow-black/20">
    <h1 class="text-3xl text-gold mb-5">
        <?php echo $mode === 'reset' ? 'Contrasenya nova' : 'Recuperar contrasenya'; ?>
    </h1>

    <?php if ($missatge !== ''): ?>
        <p role="status" class="mb-4 text-sm text-white border border-gold rounded-full px-4 py-2">
            <?php echo htmlspecialchars($missatge, ENT_QUOTES, 'UTF-8'); ?>
        </p>
    <?php endif; ?>

    <?php if ($errors !== []): ?>
        <ul role="alert" class="mb-4 text-sm text-white border border-red-400 rounded-lg px-4 py-2 list-disc pl-8">
            <?php foreach ($errors as $error): ?>
                <li><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>

    <?php if ($mode === 'reset'): ?>
        <form method="post" action="/recuperar">
            <input type="hidden" name="token" value="<?php echo htmlspecialchars($token, ENT_QUOTES, 'UTF-8'); ?>">
            <label for="password" class="block mt-3 mb-2 ml-1 text-base text-gold">Contrasenya nova</label>
            <input id="password" name="password" type="password" autocomplete="new-password" required
                   aria-describedby="password-help"
                   class="w-full h-12 px-5 text-sm text-white placeholder:text-muted bg-field border border-gold rounded-full">
            <p id="password-help" class="mt-1 ml-1 text-xs text-muted">8 caràcters mínim, amb majúscula, minúscula i número.</p>

            <label for="password2" class="block mt-5 mb-2 ml-1 text-base text-gold">Repeteix la contrasenya</label>
            <input id="password2" name="password2" type="password" autocomplete="new-password" required
                   class="w-full h-12 px-5 text-sm text-white placeholder:text-muted bg-field border border-gold rounded-full">
            <button type="submit" class="w-full h-12 mt-8 text-base text-[#1B1B33] bg-gold rounded-full hover:brightness-110">DESA LA CONTRASENYA</button>
        </form>
    <?php else: ?>
        <form method="post" action="/recuperar">
            <label for="email" class="block mt-3 mb-2 ml-1 text-base text-gold">Correu electrònic</label>
            <input id="email" name="email" type="email" autocomplete="email" required
                   placeholder="traveler@example.com"
                   class="w-full h-12 px-5 text-sm text-white placeholder:text-muted bg-field border border-gold rounded-full">
            <button type="submit" class="w-full h-12 mt-8 text-base text-[#1B1B33] bg-gold rounded-full hover:brightness-110">ENVIA L'ENLLAÇ</button>
        </form>
    <?php endif; ?>

    <p class="mt-6 text-sm text-center text-muted"><a href="/login" class="text-gold underline underline-offset-2 hover:brightness-110">Torna a l'accés</a></p>
</main>
</body>
</html>
