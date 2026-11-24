# Pràctica 04 — Archons Posts (builds de Genshin)

**Autor:** Joan Diaz

## Què s'ha fet

S'ha redissenyat la portada segons `accessible/index.html` (Tailwind CDN + `accessibility.css`) i s'ha convertit l'aplicació en una base de dades de **builds de 4 personatges**:

- **Portada (`index.php`):** banners i esdeveniments laterals, filtres funcionals i paginació de **5 builds per pàgina** (en lloc del «Load more» del disseny).
- **Filtres:** títol, autor, reacció, rol i ordre (`likes`, `views`, `recent`). Els filtres es conserven en enllaçar a les altres pàgines.
- **Targeta:** element deduït del personatge de la posició 1, 4 retrats amb el nom com a `alt`, rol, DPS compacte (`142000` → `142K`), reacció, autor, vistes i likes funcionals. El títol enllaça a `build.php`. Els likes són persistents per usuari autenticat (taula `article_likes`); els anònims són redirigits al login.
- **Ficha (`build.php?id=...`):** mostra tots els camps de la targeta, els 4 personatges amb posició/element/arma/rareza i la descripció (`cos`). Només l'autor veu «Edita» i «Esborra».
- **Formulari (`build_form.php`):** títol, descripció, reacció (obligatòria), rol, DPS enter i 4 personatges diferents. No es pot publicar si falta imatge, si un personatge no existeix o si es repeteix.
- **Catàleg admin (`personatges.php`):** pantalla web per afegir/editar/esborrar personatges; només accessible amb `admin = 1`. La foto es pot escriure a mà o pujar amb el selector de fitxers (PNG/WebP, màx. 2 MB, desat a `img/personatges/<id_externo>.ext`). Un personatge en ús no es pot esborrar.
- **Accés:** l'anònim veu tots els builds en lectura; l'usuari autenticat veu i gestiona només els seus. La propietat es comprova també a la SQL, no només a la interfície.
- **Login, registre, recuperació, sessió de 40 minuts i cookie «Recorda'm»** mantinguts de la pràctica anterior, amb redireccions relatives a l'arrel de `/NF1/` corregides.

No s'han afegit dades d'exemple: el catàleg i la llista de builds comencen buits.

## Base de dades

Taula `usuaris`: `id`, `usermail`, `username`, `password`, `admin`, `remember_token`, `reset_token`, `reset_expiry`.

Taula `personatges` (catàleg reutilitzable):

| Camp | Tipus | Observacions |
|---|---|---|
| `id` | int AI | identificador intern |
| `id_externo` | varchar(50), UNIQUE | slug amb guions baixos, p. ex. `raiden_shogun` |
| `nom` | varchar(100) | nom visible |
| `imatge` | varchar(255), nullable | ruta relativa; sense imatge no es pot publicar |
| `element` | ENUM | `anemo`, `cryo`, `dendro`, `electro`, `geo`, `hydro`, `pyro` |
| `rareza` | tinyint unsigned | només el número (4, 5...) |
| `arma` | ENUM | `Sword`, `Claymore`, `Polearm`, `Bow`, `Catalyst` |

Taula `articles` (un build): `id`, `titol`, `cos`, `usuari_id` (FK a `usuaris`, `ON DELETE SET NULL`), `reaccio`, `rol` (`main-dps`, `sub-dps`, `support`), `dps` (enter), `vistas`, `likes`, `created_at` (`DEFAULT CURRENT_TIMESTAMP`). **L'element no s'hi desa**: es calcula a la vista a partir del personatge 1. Les `vistas` s'incrementen en obrir la fitxa (una vegada per sessió/build). Els `likes` són persistents per usuari autenticat a `article_likes` (PK `article_id, usuari_id`, FKs CASCADE) i el comptador `articles.likes` es sincronitza en cada toggle.

Taula `article_personatge`: `article_id`, `personatge_id`, `posicio` (1..4). Clau primària `(article_id, posicio)` i clau única `(article_id, personatge_id)` per evitar personatges repetits. Les FK usen `CASCADE` en esborrar el build i `RESTRICT` en esborrar un personatge en ús.

`config/backend_joan_diaz.sql` és l'esquema complet. `config/alter_backend_joan_diaz.sql` és la migració idempotent per a una BDD ja existent: afegeix columnes/taules, esborra els articles antics sense 4 personatges i després fa obligatòries `reaccio` i `rol`.

## Posada en marxa

1. Arrenca Apache i MySQL des de XAMPP.
2. Importa `config/backend_joan_diaz.sql` a phpMyAdmin. Si ja tenies la BDD del login, importa `config/alter_backend_joan_diaz.sql` (es pot executar diverses vegades).
3. Comprova la connexió a `core/db_conn.php` (`root` sense contrasenya per defecte, BDD `backend_joan_diaz`).
4. Registra un usuari des de `register.php`. Per accedir a l'administració, posa `admin = 1` a aquest usuari des de phpMyAdmin.
5. Obre `personatges.php` amb aquest usuari i afegeix personatges. Pots escriure la ruta a mà o bé prémer «Examina els fitxers» i triar un PNG/WebP de màxim 2 MB: es guardarà a `img/personatges/<id_externo>.ext` (si el nom ja existeix, s'afegeix `_1`, `_2`...). Si hi ha fitxer triat, aquest substitueix la ruta escrita. Les carpetes d'assets ja existeixen.
6. Obre `index.php` i crea builds amb «Nou build». Les vistes s'incrementen en obrir la fitxa i els likes es poden donar/treure des de la web; també es poden ajustar manualment des de phpMyAdmin si cal.

## Fitxers nous i modificats

| Fitxer | Funció |
|---|---|
| `config/backend_joan_diaz.sql`, `config/alter_backend_joan_diaz.sql` | Esquema complet i migració idempotent. |
| `core/format.php` | Elements, rols, armes, etiqueta de rol i format de DPS. |
| `Model/personatge.model.php` | Catàleg; només retorna personatges amb imatge per als formularis. |
| `Model/article.model.php` | Filters, paginació, càrrega dels 4 personatges i transaccions d'escriptura. |
| `Controller/Article/paginacio.controller.php` | Portada, filtres i paginació. |
| `Controller/Article/article.controller.php` | Alta, edició i esborrat amb validació i PRG. |
| `Controller/Article/build.controller.php`, `build_form.controller.php` | Ficha i formulari de builds. |
| `Controller/Admin/personatges.controller.php` | Administració del catàleg (solo `admin = 1`). |
| `view/Article/paginacio.php`, `build.php`, `formBuild.php` | Portada, ficha i formulari amb Tailwind. |
| `view/Admin/personatges.php` | Taula i formulari del catàleg. |
| `view/partials/site-header.php`, `site-footer.php` | Capçalera i peu compartits. |
| `index.php`, `build.php`, `build_form.php`, `personatges.php` | Punts d'entrada. |
| `Model/users.model.php`, `Controller/Users/*.php` | Correcció de placeholders duplicats i redireccions. |
| `img/banners`, `img/events`, `img/icons`, `img/personatges` | Assets estàtics del disseny. |

## Seguretat i accessibilitat

- Sentències preparades a totes les consultes; `ATTR_EMULATE_PREPARES = false`, de manera que cada placeholder named és únic.
- `htmlspecialchars()` en tota la sortida; `alt` amb el nom del personatge i elements decoratius amb `alt=""` / `aria-hidden`.
- Enllaç «Skip to main content», `nav` amb `aria-label` diferents, `fieldset`/`legend`, `role="status"` per als missatges i Anells de focus visibles.
- Confirmació JavaScript abans d'esborrar; patró PRG després de cada escriptura.
- Totes les operacions d'edició d'un build porten `usuari_id` a la clàusula `WHERE`; el catàleg només el pot tocar un administrador.
