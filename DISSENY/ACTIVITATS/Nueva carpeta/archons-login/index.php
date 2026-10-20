<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Archons Posts</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Orbitron:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/main.css">
</head>
<body>

<!-- Iconos reutilizables -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
        <g id="heart"><path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></g>
        <g id="el-electro"><path d="M13 2 5 13h6l-1 9 8-12h-6l1-8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></g>
        <g id="el-pyro"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-4 3-7 1 1 2 2 3 2 0-2-1-4 0-7Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></g>
        <g id="el-hydro"><path d="M12 2C8 8 5 11 5 15a7 7 0 0 0 14 0c0-4-3-7-7-13Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></g>
        <g id="el-anemo"><path d="M3 9h10a3 3 0 1 0-3-3M3 14h14a3 3 0 1 1-3 3M6 19h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></g>
        <g id="el-cryo"><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></g>
        <g id="el-geo"><path d="m12 2 8 10-8 10-8-10 8-10Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></g>
        <g id="el-dendro"><path d="M12 2c6 2 9 8 6 14-2 3-6 5-6 6 0-1-4-3-6-6C3 10 6 4 12 2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></g>
    </defs>
</svg>

<header class="topbar">
    <a class="brand" href="index.php" aria-label="Archons Posts">
        <svg class="brand__icon" viewBox="0 0 32 36" aria-hidden="true">
            <path d="M16 0C7 0 0 7 0 16c0 9 6 20 16 20s16-11 16-20C32 7 25 0 16 0Z" fill="currentColor"/>
            <path d="M5 15c3 0 6 1.5 8 4-3 1-6 .5-8-1.5Z M27 15c-3 0-6 1.5-8 4 3 1 6 .5 8-1.5Z" fill="#10152A"/>
        </svg>
        <span class="brand__name">ARCHONS POSTS</span>
    </a>
    <a class="topbar__center" href="newsletter.php">Newsletter</a>
    <nav class="topbar__auth" aria-label="Account">
        <a href="login.php">Login</a> or <a href="register.php">Register</a>
    </nav>
</header>

<main class="layout">

    <aside class="side side--left" aria-labelledby="banners-title">
        <h2 class="side__title" id="banners-title">Current Banners</h2>
        <div class="thumb thumb--banner"><img src="assets/banner-1.png" alt="Banner actual 1"></div>
        <div class="thumb thumb--banner"><img src="assets/banner-2.png" alt="Banner actual 2"></div>
        <div class="thumb thumb--banner"><img src="assets/banner-3.png" alt="Banner actual 3"></div>
    </aside>

    <section class="center" aria-label="Builds">
        <form class="filters" action="#" method="get">
                <div class="filter">
                    <label for="f-title">Title</label>
                    <div class="pill">
                        <input type="text" id="f-title" placeholder="Lohen Melt...">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M16 16l5 5"/></svg>
                    </div>
                </div>
                <div class="filter">
                    <label for="f-author">Author</label>
                    <div class="pill">
                        <input type="text" id="f-author" placeholder="TravelerPaimon...">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M16 16l5 5"/></svg>
                    </div>
                </div>
                <div class="filter">
                    <label for="f-reaction">Reaction</label>
                    <div class="pill">
                        <input type="text" id="f-reaction" placeholder="HyperBloom...">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M16 16l5 5"/></svg>
                    </div>
                </div>
                <div class="filter">
                    <label for="f-role">Role</label>
                    <div class="pill pill--select">
                        <select id="f-role"><option>DPS...</option></select>
                    </div>
                </div>
                <div class="filter">
                    <label for="f-order">Order</label>
                    <div class="pill pill--select">
                        <select id="f-order"><option>Likes ↑</option></select>
                    </div>
                </div>
        </form>

        <div class="table-wrap">
            <table class="builds">
                <thead>
                    <tr>
                        <th scope="col"><span class="sr-only">Element</span></th>
                        <th scope="col">Build Name</th>
                        <th scope="col">Calculated DPS</th>
                        <th scope="col">Role</th>
                        <th scope="col">Team</th>
                        <th scope="col">Author</th>
                        <th scope="col">Likes</th>
                        <th scope="col">Views</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="cell-el"><svg class="el el--electro" viewBox="0 0 24 24" width="22" height="22" aria-label="Electro"><use href="#el-electro"/></svg></td>
                        <td class="cell-name">Sample Text</td>
                        <td class="cell-dps">Sample text</td>
                        <td class="cell-muted">Sample text</td>
                        <td class="cell-muted">Team_Images</td>
                        <td class="cell-muted">FulatinoXx</td>
                        <td class="cell-num"><svg class="heart" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><use href="#heart"/></svg>67</td>
                        <td class="cell-num">200</td>
                    </tr>
                    <tr>
                        <td class="cell-el"><svg class="el el--pyro" viewBox="0 0 24 24" width="22" height="22" aria-label="Pyro"><use href="#el-pyro"/></svg></td>
                        <td class="cell-name">Sample Text</td>
                        <td class="cell-dps">Sample text</td>
                        <td class="cell-muted">Sample text</td>
                        <td class="cell-muted">Team_Images</td>
                        <td class="cell-muted">FulatinoXx</td>
                        <td class="cell-num"><svg class="heart" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><use href="#heart"/></svg>67</td>
                        <td class="cell-num">200</td>
                    </tr>
                    <tr>
                        <td class="cell-el"><svg class="el el--hydro" viewBox="0 0 24 24" width="22" height="22" aria-label="Hydro"><use href="#el-hydro"/></svg></td>
                        <td class="cell-name">Sample Text</td>
                        <td class="cell-dps">Sample text</td>
                        <td class="cell-muted">Sample text</td>
                        <td class="cell-muted">Team_Images</td>
                        <td class="cell-muted">FulatinoXx</td>
                        <td class="cell-num"><svg class="heart" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><use href="#heart"/></svg>67</td>
                        <td class="cell-num">200</td>
                    </tr>
                    <tr>
                        <td class="cell-el"><svg class="el el--anemo" viewBox="0 0 24 24" width="22" height="22" aria-label="Anemo"><use href="#el-anemo"/></svg></td>
                        <td class="cell-name">Sample Text</td>
                        <td class="cell-dps">Sample text</td>
                        <td class="cell-muted">Sample text</td>
                        <td class="cell-muted">Team_Images</td>
                        <td class="cell-muted">FulatinoXx</td>
                        <td class="cell-num"><svg class="heart" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><use href="#heart"/></svg>67</td>
                        <td class="cell-num">200</td>
                    </tr>
                    <tr>
                        <td class="cell-el"><svg class="el el--cryo" viewBox="0 0 24 24" width="22" height="22" aria-label="Cryo"><use href="#el-cryo"/></svg></td>
                        <td class="cell-name">Sample Text</td>
                        <td class="cell-dps">Sample text</td>
                        <td class="cell-muted">Sample text</td>
                        <td class="cell-muted">Team_Images</td>
                        <td class="cell-muted">FulatinoXx</td>
                        <td class="cell-num"><svg class="heart" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><use href="#heart"/></svg>67</td>
                        <td class="cell-num">200</td>
                    </tr>
                    <tr>
                        <td class="cell-el"><svg class="el el--geo" viewBox="0 0 24 24" width="22" height="22" aria-label="Geo"><use href="#el-geo"/></svg></td>
                        <td class="cell-name">Sample Text</td>
                        <td class="cell-dps">Sample text</td>
                        <td class="cell-muted">Sample text</td>
                        <td class="cell-muted">Team_Images</td>
                        <td class="cell-muted">FulatinoXx</td>
                        <td class="cell-num"><svg class="heart" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><use href="#heart"/></svg>67</td>
                        <td class="cell-num">200</td>
                    </tr>
                    <tr>
                        <td class="cell-el"><svg class="el el--dendro" viewBox="0 0 24 24" width="22" height="22" aria-label="Dendro"><use href="#el-dendro"/></svg></td>
                        <td class="cell-name">Sample Text</td>
                        <td class="cell-dps">Sample text</td>
                        <td class="cell-muted">Sample text</td>
                        <td class="cell-muted">Team_Images</td>
                        <td class="cell-muted">FulatinoXx</td>
                        <td class="cell-num"><svg class="heart" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><use href="#heart"/></svg>67</td>
                        <td class="cell-num">200</td>
                    </tr>
                    <tr>
                        <td class="cell-el"><svg class="el el--pyro" viewBox="0 0 24 24" width="22" height="22" aria-label="Pyro"><use href="#el-pyro"/></svg></td>
                        <td class="cell-name">Sample Text</td>
                        <td class="cell-dps">Sample text</td>
                        <td class="cell-muted">Sample text</td>
                        <td class="cell-muted">Team_Images</td>
                        <td class="cell-muted">FulatinoXx</td>
                        <td class="cell-num"><svg class="heart" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><use href="#heart"/></svg>67</td>
                        <td class="cell-num">200</td>
                    </tr>
                    <tr>
                        <td class="cell-el"><svg class="el el--hydro" viewBox="0 0 24 24" width="22" height="22" aria-label="Hydro"><use href="#el-hydro"/></svg></td>
                        <td class="cell-name">Sample Text</td>
                        <td class="cell-dps">Sample text</td>
                        <td class="cell-muted">Sample text</td>
                        <td class="cell-muted">Team_Images</td>
                        <td class="cell-muted">FulatinoXx</td>
                        <td class="cell-num"><svg class="heart" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><use href="#heart"/></svg>67</td>
                        <td class="cell-num">200</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <aside class="side side--right" aria-labelledby="events-title">
        <h2 class="side__title" id="events-title">Active Events</h2>
        <div class="thumb thumb--event"><img src="assets/event-1.png" alt="Evento activo 1"></div>
        <div class="thumb thumb--event"><img src="assets/event-2.png" alt="Evento activo 2"></div>
        <div class="thumb thumb--event"><img src="assets/event-3.png" alt="Evento activo 3"></div>
    </aside>

</main>
</body>
</html>
