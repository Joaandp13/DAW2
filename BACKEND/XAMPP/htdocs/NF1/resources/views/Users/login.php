<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Vista del formulari d'accés, adaptada del disseny accessible
 * (accessible/login.html) a PHP. Els errors es mostren en una regió
 * aria-live i els camps conserven el valor introduït.
 */
require_once __DIR__ . '/../../../app/Core/auth.php';

// La vista només es carrega des del controlador.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    header('Location: /login');
    exit;
}

$flash = treureFlash();
?>
<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Log in · Archons Posts</title>
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

<!-- Enllaç de drecera: primer element enfocable de la pàgina -->
<a href="#main" class="skip-link">Vés al contingut principal</a>

<header>
    <a href="/" aria-label="Archons Posts — Inici" class="flex items-center gap-3 text-gold">
        <span aria-hidden="true" class="block w-8 h-9 bg-gold" style="-webkit-mask: url('/img/icons/alien-icon.svg') center / contain no-repeat; mask: url('/img/icons/alien-icon.svg') center / contain no-repeat;"></span>
        <span class="font-logo text-2xl tracking-wider">ARCHONS POSTS</span>
    </a>
</header>

<main id="main" class="w-full max-w-5xl">

    <section aria-labelledby="login-title" class="grid md:grid-cols-2 bg-panel border border-[#323a6b] rounded-lg overflow-hidden shadow-2xl shadow-black/20">

        <!-- Bloc decoratiu: imatge amagada per a lectors de pantalla -->
        <div class="flex flex-col items-center justify-center text-center p-10 md:p-14 bg-gradient-to-br from-[#12172E] via-panel to-[#5e3d18]">
            <img src="/img/icons/paimon_login.png" alt="" aria-hidden="true" class="w-48 md:w-56 mb-6">
            <p class="text-2xl mb-4">Welcome back, Traveler</p>
            <p class="text-base text-white">Share your builds, and find the best<br>team for your companions</p>
        </div>

        <!-- Formulari -->
        <div class="flex flex-col p-10 md:px-14 md:py-16">
            <h1 id="login-title" class="text-3xl text-gold mb-5">Inicia sessió</h1>

            <?php if ($flash !== []): ?>
                <p role="status" class="mb-4 text-sm text-white border border-gold rounded-full px-4 py-2">
                    <?php echo htmlspecialchars((string) $flash['missatge'], ENT_QUOTES, 'UTF-8'); ?>
                </p>
            <?php endif; ?>

            <?php if ($errors !== []): ?>
                <p id="login-error" role="alert" class="mb-4 text-sm text-white border border-red-400 rounded-full px-4 py-2">
                    <?php echo htmlspecialchars(implode(' ', $errors), ENT_QUOTES, 'UTF-8'); ?>
                </p>
            <?php endif; ?>

            <form method="post" action="/login" aria-labelledby="login-title">
                <fieldset class="min-w-0 border-0 p-0 m-0">
                    <legend class="sr-only">Dades d'accés</legend>

                    <label for="user" class="block mt-3 mb-2 ml-1 text-base text-gold">Nom d'usuari o correu</label>
                    <input id="user" name="user" type="text" placeholder="traveler123" autocomplete="username"
                           value="<?php echo htmlspecialchars($usuari, ENT_QUOTES, 'UTF-8'); ?>"
                           aria-invalid="<?php echo $errors !== [] ? 'true' : 'false'; ?>"
                           <?php echo $errors !== [] ? 'aria-describedby="login-error"' : ''; ?>
                           class="w-full h-12 px-5 text-sm text-white placeholder:text-muted bg-field border border-gold rounded-full">
                    <p id="user-error" class="sr-only" aria-live="assertive" aria-atomic="true"></p>

                    <label for="pass" class="block mt-5 mb-2 ml-1 text-base text-gold">Contrasenya</label>
                    <div class="relative">
                        <input id="pass" name="pass" type="password" placeholder="••••••••••••••" autocomplete="current-password"
                               aria-invalid="<?php echo $errors !== [] ? 'true' : 'false'; ?>"
                               <?php echo $errors !== [] ? 'aria-describedby="login-error"' : ''; ?>
                               class="w-full h-12 pl-5 pr-12 text-sm text-white placeholder:text-muted bg-field border border-gold rounded-full">
                        <p id="pass-error" class="sr-only" aria-live="assertive" aria-atomic="true"></p>
                        <button type="button" data-toggle-pass aria-label="Mostra la contrasenya" aria-pressed="false" aria-controls="pass"
                                class="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </div>

                    <div class="flex items-center justify-between mt-5 mb-8 text-sm">
                        <label for="remember" class="flex items-center gap-1.5 text-muted cursor-pointer">
                            <input id="remember" name="remember" type="checkbox" value="1" class="accent-gold" <?php echo $recordar ? 'checked' : ''; ?>> Recorda'm
                        </label>
                        <a href="/recuperar" class="text-gold underline underline-offset-2 hover:brightness-110">Has oblidat la contrasenya?</a>
                    </div>
                </fieldset>

                <button type="submit" class="w-full h-12 text-base text-[#1B1B33] bg-gold rounded-full hover:brightness-110">LOG IN</button>
            </form>

            <p class="my-6 text-base text-center text-muted">o</p>

            

            <!-- Accions de proveïdors externs -->
            <?php
            $proveidorsOAuth = [
                ['provider' => 'GitHub', 'label' => 'Inicia sessió amb GitHub', 'icon' => 'img/icons/github_icon.svg', 'iconClass' => 'w-5 h-5 block'],
                ['provider' => 'Discord', 'label' => 'Inicia sessió amb Discord', 'icon' => 'img/icons/discord_logo.svg', 'iconClass' => 'w-5 h-5 block'],
            ];
            ?>

<div class="flex gap-3" role="group" aria-label="Inicia sessió amb un compte extern">
    <?php foreach ($proveidorsOAuth as $p): ?>
            <a href="/oauth?provider=<?php echo htmlspecialchars($p['provider'], ENT_QUOTES, 'UTF-8'); ?>"
               aria-label="<?php echo htmlspecialchars($p['label'], ENT_QUOTES, 'UTF-8'); ?>"
               class="flex-1 h-11 grid place-items-center border border-gold rounded-full hover:bg-[#343C73] hover:brightness-110 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                <img src="<?php echo htmlspecialchars($p['icon'], ENT_QUOTES, 'UTF-8'); ?>" alt="" aria-hidden="true" class="<?php echo $p['iconClass']; ?>">
            </a>
    <?php endforeach; ?>
</div>

            <p class="mt-6 text-sm text-center text-muted">No tens compte? <a href="/register" class="text-gold underline underline-offset-2 hover:brightness-110">Crea'n un</a></p>
        </div>
    </section>
</main>

<script>
    // Mostra/amaga la contrasenya i manté l'estat accessible del botó.
    document.querySelector('[data-toggle-pass]').addEventListener('click', function () {
        const camp = document.getElementById('pass');
        const mostrar = camp.type === 'password';
        camp.type = mostrar ? 'text' : 'password';
        this.setAttribute('aria-label', mostrar ? 'Amaga la contrasenya' : 'Mostra la contrasenya');
        this.setAttribute('aria-pressed', String(mostrar));
    });
</script>
</body>
</html>
