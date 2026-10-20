<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Log in · Archons Posts</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Orbitron:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
<main class="page">

    <a class="brand" href="index.php" aria-label="Archons Posts">
        <svg class="brand__icon" viewBox="0 0 32 36" aria-hidden="true">
            <path d="M16 0C7 0 0 7 0 16c0 9 6 20 16 20s16-11 16-20C32 7 25 0 16 0Z" fill="currentColor"/>
            <path d="M5 15c3 0 6 1.5 8 4-3 1-6 .5-8-1.5Z M27 15c-3 0-6 1.5-8 4 3 1 6 .5 8-1.5Z" fill="#10152A"/>
        </svg>
        <span class="brand__name">ARCHONS POSTS</span>
    </a>

    <section class="card">

        <!-- Panel izquierdo -->
        <aside class="card__hero">
            <img class="hero__img" src="assets/paimon.png" alt="Paimon saludando" width="140" height="120">
            <h2 class="hero__title">Welcome back, Traveler</h2>
            <p class="hero__text">Share your builds, and find the best<br>team for your companions</p>
        </aside>

        <!-- Panel derecho -->
        <div class="card__form">
            <h1 class="form__title">Log in</h1>

            <form method="post" action="login.php" novalidate>

                <label class="field__label" for="identifier">Username or Email</label>
                <input class="field__input" type="text" id="identifier" name="identifier"
                       placeholder="Pepita de los palotes" autocomplete="username" required>

                <label class="field__label" for="password">Password</label>
                <div class="field__wrap">
                    <input class="field__input" type="password" id="password" name="password"
                           placeholder="••••••••••••••" autocomplete="current-password" required>
                    <button class="field__eye" type="button" id="togglePassword" aria-label="Show password">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                </div>

                <div class="row">
                    <label class="check">
                        <input type="checkbox" name="remember" value="1">
                        <span class="check__box" aria-hidden="true"></span>
                        <span class="check__text">Remember me</span>
                    </label>
                    <a class="link link--small" href="forgot-password.php">Forgot password?</a>
                </div>

                <button class="btn" type="submit">LOG IN</button>
            </form>

            <p class="divider">or</p>

            <div class="social">
                <a class="social__btn" href="oauth/google.php" aria-label="Continue with Google">
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><text x="12" y="18.5" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="currentColor">G</text></svg>
                </a>
                <a class="social__btn" href="oauth/reddit.php" aria-label="Continue with Reddit">
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <circle cx="12" cy="14" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
                        <circle cx="9" cy="13" r="1.4" fill="currentColor"/><circle cx="15" cy="13" r="1.4" fill="currentColor"/>
                        <path d="M9 17c2 1.2 4 1.2 6 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        <circle cx="19" cy="5" r="1.8" fill="currentColor"/><path d="M12 6l1.5-4 5 1.5" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                </a>
                <a class="social__btn" href="oauth/discord.php" aria-label="Continue with Discord">
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <path d="M3 18c0-6 2-11 5-13l1 2h6l1-2c3 2 5 7 5 13-2 2-4 2-5 2l-1-2H9l-1 2c-1 0-3 0-5-2Z" fill="currentColor"/>
                        <circle cx="9" cy="13" r="1.6" fill="#262D52"/><circle cx="15" cy="13" r="1.6" fill="#262D52"/>
                    </svg>
                </a>
                <a class="social__btn" href="oauth/x.php" aria-label="Continue with X">
                    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                        <path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.190L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.830L0 1.154h7.594l5.243 6.932ZM17.610 20.644h2.039L6.486 3.240H4.298Z"/>
                    </svg>
                </a>
            </div>

            <p class="signup">New around here? <a class="link" href="register.php">Create an account</a></p>
        </div>
    </section>
</main>

</body>
</html>
