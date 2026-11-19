# Exercicis de Finestres (TypeScript)

Aquest directori recull els exercicis de Client sobre l'objecte `window` i tot
el que hi està relacionat: finestres emergents, geometria, navegació,
comunicació entre finestres, temporitzadors, diàlegs i emmagatzematge.

> **Guia completa en castellà:**
> [GUIA_VENTANAS_Y_LOCALSTORAGE.md](GUIA_VENTANAS_Y_LOCALSTORAGE.md)
> — totes les funcions de `window`, l'API de `localStorage` i l'explicació
> detallada de l'exercici **Xat**.

Els exercicis nous (3–8) segueixen el mateix patró que els existents (1, 2 i
Xat): codi TypeScript en una carpeta pròpia i el resultat compilat dins de
`dist/`, amb l'HTML al costat del JavaScript compilat.

## Estructura

```
Finestres/
├── 1/
│   └── app.ts                  # screen, navigator i location
├── 2/
│   └── app.ts                  # informació + iframe
├── 3/
│   ├── app.ts                  # obrir/controlar finestres
│   └── fill.ts                 # finestra emergent
├── 4/
│   └── app.ts                  # mides, posició, scroll, fullscreen
├── 5/
│   └── app.ts                  # location, URLSearchParams i history
├── 6/
│   ├── tipus.ts                # tipus compartits del protocol de missatges
│   ├── pare.ts                 # finestra pare
│   └── fill.ts                 # finestra filla (postMessage)
├── 7/
│   └── app.ts                  # alert/confirm/prompt i temporitzadors
├── 8/
│   └── app.ts                  # storage, cicle de vida i BroadcastChannel
├── Xat/                        # exercici de xat amb localStorage
├── dist/                       # HTML + JS compilat
│   ├── estils.css              # estil comú dels exercicis 3–8
│   ├── index.html              # índex navegable
│   ├── 1/hello.html
│   ├── 2/hello.html
│   ├── 3/index.html + fill.html
│   ├── 4/index.html
│   ├── 5/index.html
│   ├── 6/index.html + fill.html
│   ├── 7/index.html
│   └── 8/index.html
├── package.json
└── tsconfig.json
```

## Compilar

Des de `CLIENT/Exercicis/Finestres`:

```powershell
npx tsc -p .
```

El `tsconfig.json` compila tots els `.ts` mantenint l'estructura de carpetes
dins de `dist/`. Si `tsc` no està instal·lat globalment:

```powershell
npm install --no-save typescript
npx tsc -p .
```

## Executar

**Important:** no obris els HTML directament amb `file://`. Els scripts
`type="module"`, els popups, `postMessage`, l'emmagatzematge i l'historial es
comporten de manera diferent (o fallen) amb el protocol `file:`.

Serveix la carpeta `dist` per HTTP:

```powershell
python -m http.server 8099 --directory dist
```

I obre: <http://localhost:8099/>

També pots copiar el contingut de `dist/` dins de `htdocs` de XAMPP i accedir-hi
per `http://localhost/...`.

## Exercicis

| # | Tema | Conceptes principals |
|---|------|----------------------|
| 1 | Informació del sistema | `screen`, `navigator`, `location`, detecció de mòbil i SO |
| 2 | Informació i marcs | `iframe`, `contentDocument`, `contentWindow`, escriptura dins del marc |
| 3 | Obrir i controlar finestres | `window.open`, nom de finestra, popups bloquejats, `closed`, `focus`, `moveTo`, `resizeTo`, `close` |
| 4 | Mides i posició | `innerWidth/Height`, `outerWidth/Height`, `screenX/Y`, `devicePixelRatio`, `scrollX/Y`, `visualViewport`, `matchMedia`, `scrollTo/By`, pantalla completa |
| 5 | Navegació | `location`, `URL`, `URLSearchParams`, `history.pushState/replaceState/back/forward/go`, `popstate`, `hashchange` |
| 6 | Comunicació entre finestres | `window.opener`, `postMessage`, `event.source`, `event.origin`, `targetOrigin`, type guards |
| 7 | Diàlegs i temporitzadors | `alert`, `confirm`, `prompt`, `print`, `setTimeout`, `setInterval`, `requestAnimationFrame` i les seves cancel·lacions |
| 8 | Emmagatzematge i cicle de vida | `localStorage`, `sessionStorage`, esdeveniment `storage`, `online/offline`, `visibilitychange`, `beforeunload`, `pageshow/pagehide`, `BroadcastChannel` |

Cada pàgina inclou un registre d'accions per veure què passa en temps real.

## Resum de l'objecte `window`

### Referències i identitat

- `window` és l'objecte global del navegador.
- `self` és una referència a la mateixa finestra.
- `top` és la finestra més externa; `parent` és el marc que la conté.
- `opener` és la finestra que l'ha oberta amb `window.open()`.
- `name` és el nom de la finestra (el segon paràmetre de `window.open`).
- `closed` indica si la finestra s'ha tancat.
- `frames` i `length` donen accés als marcs fills.

### Obrir i tancar

```ts
const f: Window | null = window.open("fill.html", "nomFinestra", "width=600,height=400");
f?.focus();
f?.moveTo(100, 100);
f?.resizeTo(800, 600);
f?.close();
```

- `window.open()` retorna `null` si el navegador bloqueja el popup.
- Reutilitzar el mateix nom evita obrir finestres duplicades.
- Els navegadors poden ignorar `moveTo()`/`resizeTo()` si la finestra no s'ha
  obert amb `window.open()`.

### Geometria i pantalla

- Finestra: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`,
  `screenX`, `screenY`, `scrollX`, `scrollY`, `devicePixelRatio`.
- Pantalla: `screen.width`, `screen.height`, `screen.availWidth`,
  `screen.availHeight`, `screen.orientation`.
- Desplaçament: `scrollTo()`, `scrollBy()`, `scroll()`, `visualViewport`.
- Media queries: `window.matchMedia("(max-width: 600px)")`.

### Navegació

- `location.href`, `protocol`, `host`, `hostname`, `port`, `pathname`,
  `search`, `hash`, `origin`.
- `location.assign()`, `location.replace()`, `location.reload()`.
- `URL` i `URLSearchParams` per construir i llegir URLs.
- `history.length`, `history.state`, `history.back()`, `history.forward()`,
  `history.go(n)`, `history.pushState()`, `history.replaceState()`.
- Esdeveniments `popstate` i `hashchange`.

### Diàlegs i temporitzadors

```ts
window.alert("Avís");
const ok: boolean = window.confirm("Continuar?");
const text: string | null = window.prompt("Nom?", "Joan");

const id: number = window.setTimeout(() => {}, 1000);
window.clearTimeout(id);

const interval: number = window.setInterval(() => {}, 1000);
window.clearInterval(interval);

const frame: number = window.requestAnimationFrame((t) => {});
window.cancelAnimationFrame(frame);
```

### Comunicació entre finestres

```ts
// Finestra pare
const fill = window.open("fill.html");
fill?.postMessage({ tipus: "hola" }, "*");

window.addEventListener("message", (event: MessageEvent<unknown>) => {
  if (event.source !== fill) return;              // valida la font
  // if (event.origin !== "https://exemple.com") return; // valida l'origen
  console.log(event.data);
});

// Finestra filla
window.opener?.postMessage({ tipus: "resposta" }, "*");
```

- `targetOrigin` hauria de ser un origen concret en producció, no `"*"`.
- Amb `file://` l'origen és la cadena `"null"`; per això és millor servir per HTTP.
- `event.source` permet comprovar que el missatge ve de la finestra esperada.

### Emmagatzematge i cicle de vida

- `localStorage`: persistent per origen.
- `sessionStorage`: dura només la pestanya/finestra actual.
- L'esdeveniment `storage` només s'executa a les **altres** pestanyes del mateix origen.
- `BroadcastChannel` permet comunicar pestanyes del mateix origen sense `postMessage`.
- `navigator.onLine`, `online` i `offline` informen de la connectivitat.
- `visibilitychange` i `document.visibilityState` informen si la pestanya és visible.
- `beforeunload` permet demanar confirmació abans de tancar o recarregar.
- `pageshow` i `pagehide` formen part del cicle de vida de la pàgina.

### Seguretat bàsica

- Respecta la política del mateix origen: no es pot llegir el DOM d'una finestra
  d'un altre origen.
- Valida sempre `event.origin` i `event.source` als missatges.
- Fes servir `noopener`/`noreferrer` quan obris enllaços que no necessiten
  comunicar-se amb la pàgina que els obre.
- No facis servir `eval()` ni `document.write()` amb dades de l'usuari.
