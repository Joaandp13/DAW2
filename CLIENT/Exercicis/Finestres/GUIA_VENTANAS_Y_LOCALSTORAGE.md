# Guía de `window` y `localStorage` en TypeScript

Documento de referencia del bloque **Finestres** de Client. Recoge las
funciones, propiedades y eventos del objeto `window`, la API completa de
`localStorage`/`sessionStorage` y una explicación detallada del ejercicio
**Xat** que ya está en este directorio.

> Ejercicios prácticos relacionados:
> [1](dist/1/hello.html) · [2](dist/2/hello.html) ·
> [3](dist/3/index.html) · [4](dist/4/index.html) ·
> [5](dist/5/index.html) · [6](dist/6/index.html) ·
> [7](dist/7/index.html) · [8](dist/8/index.html)

---

## Índice

1. [Qué es `window`](#1-qué-es-window)
2. [Referencias entre ventanas](#2-referencias-entre-ventanas)
3. [Abrir y cerrar ventanas](#3-abrir-y-cerrar-ventanas)
4. [Mover, redimensionar y enfocar](#4-mover-redimensionar-y-enfocar)
5. [Tamaño, posición y scroll](#5-tamaño-posición-y-scroll)
6. [Diálogos](#6-diálogos)
7. [Temporizadores y animación](#7-temporizadores-y-animación)
8. [Navegación: `location`](#8-navegación-location)
9. [Historial: `history`](#9-historial-history)
10. [Pantalla: `screen`](#10-pantalla-screen)
11. [Navegador: `navigator`](#11-navegador-navigator)
12. [Comunicación entre ventanas](#12-comunicación-entre-ventanas)
13. [Eventos de `window`](#13-eventos-de-window)
14. [`localStorage` y `sessionStorage`](#14-localstorage-y-sessionstorage)
15. [El ejercicio Xat explicado](#15-el-ejercicio-xat-explicado)
16. [Chuleta rápida](#16-chuleta-rápida)
17. [Errores comunes y buenas prácticas](#17-errores-comunes-y-buenas-prácticas)

---

## 1. Qué es `window`

`window` es el objeto global del navegador. Todo lo que se declara con `var` en
el ámbito global, y muchos objetos del DOM, cuelgan de él:

```ts
window.document === document;          // true
window.console === console;            // true
window.navigator === navigator;        // true
window.location === location;          // true
window.localStorage === localStorage;  // true
window.self === window;                // true
```

### Propiedades principales

| Propiedad | Tipo | Para qué sirve |
|---|---|---|
| `window` / `self` | `Window` | Referencia a la propia ventana. |
| `top` | `Window` | Ventana más externa (la que contiene todos los marcos). |
| `parent` | `Window` | Ventana que contiene el marco actual. |
| `opener` | `Window \| null` | Ventana que abrió esta con `window.open()`. |
| `frames` | `Window` | Colección de marcos hijos (`window.frames[0]`, `window.frames.length`). |
| `length` | `number` | Número de marcos hijos. |
| `name` | `string` | Nombre de la ventana (segundo argumento de `window.open`). |
| `closed` | `boolean` | Indica si la ventana se ha cerrado. |
| `document` | `Document` | Documento HTML cargado. |
| `location` | `Location` | URL actual y navegación. |
| `history` | `History` | Historial de navegación. |
| `navigator` | `Navigator` | Información del navegador y APIs del dispositivo. |
| `screen` | `Screen` | Información de la pantalla física. |
| `localStorage` | `Storage` | Almacenamiento persistente por origen. |
| `sessionStorage` | `Storage` | Almacenamiento por pestaña. |
| `indexedDB` | `IDBFactory` | Base de datos NoSQL del navegador. |
| `caches` | `CacheStorage` | Caché de recursos (service workers). |
| `crypto` | `Crypto` | Funciones criptográficas (`getRandomValues`, `randomUUID`). |
| `performance` | `Performance` | Métricas de rendimiento y tiempos. |
| `console` | `Console` | Salida de depuración. |
| `visualViewport` | `VisualViewport \| null` | Viewport visual (zoom, teclado móvil). |
| `innerWidth` / `innerHeight` | `number` | Tamaño del área visible del documento. |
| `outerWidth` / `outerHeight` | `number` | Tamaño total de la ventana del navegador. |
| `screenX` / `screenY` | `number` | Posición de la ventana en la pantalla. |
| `screenLeft` / `screenTop` | `number` | Alias de `screenX`/`screenY`. |
| `scrollX` / `scrollY` | `number` | Desplazamiento horizontal/vertical del documento. |
| `pageXOffset` / `pageYOffset` | `number` | Alias de `scrollX`/`scrollY`. |
| `devicePixelRatio` | `number` | Píxeles físicos por píxel CSS. |
| `isSecureContext` | `boolean` | `true` en HTTPS o `localhost`. |
| `origin` | `string` | Origen de la ventana. |
| `frameElement` | `Element \| null` | `<iframe>` que contiene esta ventana (si es un marco). |
| `event` | `Event \| undefined` | Evento actual en navegadores antiguos (obsoleto). |
| `status` | `string` | Texto de la barra de estado (heredado, sin uso real). |

### Objetos globales útiles a los que se accede por `window`

`window` también expone constructores y funciones globales:

```ts
window.URL;
window.URLSearchParams;
window.fetch;
window.XMLHttpRequest;
window.WebSocket;
window.Worker;
window.Blob;
window.File;
window.FormData;
window.Headers;
window.Request;
window.Response;
window.AbortController;
window.TextEncoder;
window.TextDecoder;
window.Intl;
window.Math;
window.JSON;
window.Date;
```

No todos son "métodos de ventana", pero sí son accesibles desde ella.

### Tabla maestra de métodos de `window`

| Método | Firma resumida | Descripción |
|---|---|---|
| `open` | `open(url?, target?, features?)` | Abre una ventana o pestaña. Devuelve `Window \| null`. |
| `close` | `close()` | Cierra la ventana actual. |
| `focus` | `focus()` | Pone la ventana en primer plano. |
| `blur` | `blur()` | Quita el foco a la ventana. |
| `moveTo` | `moveTo(x, y)` | Mueve la ventana a coordenadas absolutas. |
| `moveBy` | `moveBy(dx, dy)` | Mueve la ventana relativamente. |
| `resizeTo` | `resizeTo(ancho, alto)` | Redimensiona a un tamaño absoluto. |
| `resizeBy` | `resizeBy(dx, dy)` | Redimensiona relativamente. |
| `scroll` | `scroll(x, y)` / `scroll(options)` | Desplaza el documento. |
| `scrollTo` | `scrollTo(x, y)` / `scrollTo(options)` | Desplaza a una posición absoluta. |
| `scrollBy` | `scrollBy(dx, dy)` / `scrollBy(options)` | Desplaza relativamente. |
| `print` | `print()` | Abre el diálogo de impresión. |
| `stop` | `stop()` | Detiene la carga del documento. |
| `alert` | `alert(mensaje)` | Muestra un aviso bloqueante. |
| `confirm` | `confirm(mensaje)` | Pide confirmación. Devuelve `boolean`. |
| `prompt` | `prompt(mensaje, valor?)` | Pide texto. Devuelve `string \| null`. |
| `postMessage` | `postMessage(datos, origen, transfer?)` | Envía un mensaje a otra ventana. |
| `getSelection` | `getSelection()` | Devuelve la selección de texto. |
| `getComputedStyle` | `getComputedStyle(elemento, pseudo?)` | Estilos calculados de un elemento. |
| `matchMedia` | `matchMedia(consulta)` | Evalúa una media query CSS. |
| `setTimeout` | `setTimeout(fn, ms, ...args)` | Ejecuta `fn` una vez. |
| `clearTimeout` | `clearTimeout(id)` | Cancela un `setTimeout`. |
| `setInterval` | `setInterval(fn, ms, ...args)` | Ejecuta `fn` repetidamente. |
| `clearInterval` | `clearInterval(id)` | Cancela un `setInterval`. |
| `requestAnimationFrame` | `requestAnimationFrame(fn)` | Ejecuta antes del siguiente repintado. |
| `cancelAnimationFrame` | `cancelAnimationFrame(id)` | Cancela una animación. |
| `requestIdleCallback` | `requestIdleCallback(fn, options?)` | Ejecuta cuando el navegador está libre. |
| `cancelIdleCallback` | `cancelIdleCallback(id)` | Cancela un `requestIdleCallback`. |
| `queueMicrotask` | `queueMicrotask(fn)` | Encola una microtarea. |
| `fetch` | `fetch(input, init?)` | Petición HTTP. Devuelve `Promise<Response>`. |
| `atob` | `atob(textoBase64)` | Decodifica Base64 a texto. |
| `btoa` | `btoa(texto)` | Codifica texto a Base64. |
| `structuredClone` | `structuredClone(valor)` | Copia profunda de un valor serializable. |
| `reportError` | `reportError(error)` | Notifica un error no capturado. |
| `addEventListener` | `addEventListener(tipo, listener, options?)` | Añade un listener de evento. |
| `removeEventListener` | `removeEventListener(tipo, listener)` | Quita un listener. |
| `dispatchEvent` | `dispatchEvent(evento)` | Lanza un evento manualmente. |
| `find` | `find(texto, ...)` | Busca texto en la página. **No estándar.** |
| `scrollByLines` | `scrollByLines(n)` | **No estándar / obsoleto.** |
| `scrollByPages` | `scrollByPages(n)` | **No estándar / obsoleto.** |
| `sizeToContent` | `sizeToContent()` | **No estándar (Firefox).** |
| `setResizable` | `setResizable(bool)` | **No estándar (Firefox).** |
| `showModalDialog` | `showModalDialog(...)` | **Obsoleto y eliminado.** |

Ejemplos de los métodos menos conocidos:

```ts
// Texto seleccionado por el usuario
const seleccion = window.getSelection();
console.log(seleccion?.toString());

// Estilos calculados
const estilo = window.getComputedStyle(document.body);
console.log(estilo.fontSize, estilo.backgroundColor);

// Base64
const codificado = window.btoa("Hola");
const decodificado = window.atob(codificado);

// Copia profunda
const original = { nombre: "Joan", datos: { edad: 20 } };
const copia = window.structuredClone(original);
copia.datos.edad = 21;
console.log(original.datos.edad); // 20

// Notificar un error
window.reportError(new Error("Error de prueba"));
```

---

## 2. Referencias entre ventanas

```ts
// Desde una ventana abierta con window.open():
window.opener;      // ventana que la abrió, o null
window.parent;      // ventana contenedora
window.top;         // ventana más externa
window.self;        // ella misma
```

Ejemplo típico de una ventana hija:

```ts
const padre = window.opener as Window | null;

if (padre !== null) {
  padre.focus();
  padre.postMessage({ tipo: "listo" }, "*");
}
```

Y desde el padre:

```ts
const hija: Window | null = window.open("hija.html", "hija");

if (hija !== null) {
  hija.focus();
  hija.postMessage({ tipo: "hola" }, "*");
}
```

> `window.opener` puede ser `null` si la ventana se abrió con
> `rel="noopener"`, con la opción `noopener` o si el navegador lo bloquea por
> seguridad.

---

## 3. Abrir y cerrar ventanas

### `window.open()`

```ts
window.open(
  url?: string | URL,
  target?: string,
  features?: string
): Window | null
```

| Parámetro | Significado |
|---|---|
| `url` | Página a cargar. Si se omite, se abre `about:blank`. |
| `target` | Nombre de la ventana. Si ya existe una con ese nombre, se reutiliza. Valores especiales: `_blank`, `_self`, `_parent`, `_top`. |
| `features` | Lista separada por comas con tamaño, posición y barras. |

Ejemplo completo:

```ts
const ancho = Math.floor(screen.availWidth / 2);
const alto = Math.floor(screen.availHeight / 2);
const izquierda = Math.floor(screen.availWidth / 2);

const ventana = window.open(
  "user.html?name=Usuari1",
  "usuario1",
  [
    "popup=yes",
    `width=${ancho}`,
    `height=${alto}`,
    `left=${izquierda}`,
    "top=0",
    "resizable=yes",
    "scrollbars=yes",
  ].join(",")
);

if (ventana === null) {
  alert("El navegador ha bloqueado la ventana emergente.");
}
```

### Opciones de `features`

| Opción | Valores | Efecto |
|---|---|---|
| `width` / `height` | píxeles | Tamaño inicial. |
| `left` / `top` | píxeles | Posición inicial. |
| `popup` | `yes` / `no` | Intenta abrir una ventana sin barras. |
| `resizable` | `yes` / `no` | Permite redimensionar. |
| `scrollbars` | `yes` / `no` | Muestra barras de desplazamiento. |
| `menubar` | `yes` / `no` | Barra de menús. |
| `toolbar` | `yes` / `no` | Barra de herramientas. |
| `location` | `yes` / `no` | Barra de direcciones. |
| `status` | `yes` / `no` | Barra de estado. |
| `noopener` | — | La ventana hija no tendrá `window.opener`. |
| `noreferrer` | — | No envía la cabecera `Referer` y aplica `noopener`. |

> Los navegadores modernos ignoran muchas de estas opciones por seguridad y
> pueden abrir el resultado como una pestaña normal. No dependas de que la
> geometría se respete exactamente.

### `window.close()`

Solo funciona con ventanas abiertas por script (con `window.open`) o con
ventanas cuyo historial tenga una sola entrada:

```ts
const hija = window.open("hija.html");

hija?.close();

// Desde la propia hija:
window.close();
```

### `window.closed`

Permite saber si la ventana sigue abierta:

```ts
if (hija === null || hija.closed) {
  console.log("La ventana hija no existe o está cerrada");
}
```

### `window.focus()` y `window.blur()`

```ts
hija?.focus();  // trae la ventana al frente
hija?.blur();   // le quita el foco
```

### `window.print()`

Abre el diálogo de impresión del navegador:

```ts
window.print();
```

### `window.stop()`

Detiene la carga de la página actual:

```ts
window.stop();
```

### `window.find()` (no estándar)

Busca texto en la página, como `Ctrl+F`. No forma parte del estándar y no está
disponible en todos los navegadores:

```ts
window.find("texto", false, false, true, false, false, false);
```

---

## 4. Mover, redimensionar y enfocar

| Método | Descripción |
|---|---|
| `window.moveTo(x, y)` | Mueve la ventana a coordenadas absolutas de pantalla. |
| `window.moveBy(dx, dy)` | Mueve la ventana relativamente. |
| `window.resizeTo(ancho, alto)` | Redimensiona a un tamaño absoluto. |
| `window.resizeBy(dx, dy)` | Redimensiona relativamente. |
| `window.focus()` | Pone la ventana en primer plano. |
| `window.blur()` | Quita el foco a la ventana. |

```ts
const hija = window.open("hija.html", "hija", "width=600,height=400");

hija?.moveTo(100, 100);
hija?.resizeTo(800, 600);
hija?.moveBy(20, 20);
hija?.resizeBy(50, 50);
hija?.focus();
```

> `moveTo`, `moveBy`, `resizeTo` y `resizeBy` suelen estar limitados o
> ignorados si la ventana no fue abierta por el script.

### Otros métodos legacy (Firefox)

| Método | Estado |
|---|---|
| `window.sizeToContent()` | No estándar. |
| `window.setResizable(bool)` | No estándar. |
| `window.scrollByLines(n)` | No estándar / obsoleto. |
| `window.scrollByPages(n)` | No estándar / obsoleto. |
| `window.captureEvents()` | Obsoleto. |
| `window.releaseEvents()` | Obsoleto. |
| `window.routeEvent()` | Obsoleto. |

---

## 5. Tamaño, posición y scroll

### Propiedades de tamaño

```ts
window.innerWidth;    // ancho visible del documento (CSS px)
window.innerHeight;   // alto visible del documento
window.outerWidth;    // ancho total de la ventana del navegador
window.outerHeight;   // alto total de la ventana
window.screenX;       // posición X de la ventana en la pantalla
window.screenY;       // posición Y
window.screenLeft;    // alias de screenX
window.screenTop;     // alias de screenY
window.scrollX;       // desplazamiento horizontal
window.scrollY;       // desplazamiento vertical
window.pageXOffset;   // alias de scrollX
window.pageYOffset;   // alias de scrollY
window.devicePixelRatio; // p. ej. 1, 1.25, 2
```

### Scroll

```ts
// Posición absoluta
window.scrollTo(0, 500);
window.scrollTo({ top: 500, left: 0, behavior: "smooth" });

// Desplazamiento relativo
window.scrollBy(0, 300);
window.scrollBy({ top: 300, behavior: "smooth" });

// Alias
window.scroll(0, 500);
window.scroll({ top: 500, behavior: "smooth" });
```

### `matchMedia()`

```ts
const oscuro = window.matchMedia("(prefers-color-scheme: dark)");

console.log(oscuro.matches);

oscuro.addEventListener("change", (evento: MediaQueryListEvent) => {
  console.log("¿Tema oscuro?", evento.matches);
});
```

### Pantalla completa

La API de pantalla completa pertenece a `document`, pero se controla desde la
ventana:

```ts
await document.documentElement.requestFullscreen();
await document.exitFullscreen();

console.log(document.fullscreenElement);
```

### `visualViewport`

Útil en móviles con zoom o teclado virtual:

```ts
const vv = window.visualViewport;

if (vv !== null) {
  console.log(vv.width, vv.height, vv.scale);
  vv.addEventListener("resize", () => {
    console.log("Viewport visual:", vv.width, vv.height);
  });
}
```

---

## 6. Diálogos

| Método | Retorno | Descripción |
|---|---|---|
| `window.alert(mensaje)` | `void` | Muestra un aviso. Bloquea la página. |
| `window.confirm(mensaje)` | `boolean` | Aceptar = `true`, cancelar = `false`. |
| `window.prompt(mensaje, valorInicial)` | `string \| null` | Texto introducido o `null` si se cancela. |

```ts
window.alert("Aviso importante");

const continuar: boolean = window.confirm("¿Quieres continuar?");

const nombre: string | null = window.prompt("¿Cómo te llamas?", "Joan");

if (nombre !== null) {
  console.log(`Hola, ${nombre}`);
}
```

> Los diálogos nativos son bloqueantes y poco personalizables. En interfaces
> modernas se prefieren `<dialog>`, modales HTML o componentes propios.

---

## 7. Temporizadores y animación

### `setTimeout` / `clearTimeout`

Ejecuta una función una sola vez:

```ts
const id: number = window.setTimeout(() => {
  console.log("Han pasado 2 segundos");
}, 2000);

window.clearTimeout(id);
```

Con argumentos:

```ts
window.setTimeout((nombre: string) => {
  console.log(`Hola, ${nombre}`);
}, 1000, "Joan");
```

### `setInterval` / `clearInterval`

Ejecuta una función repetidamente:

```ts
let segundos = 0;

const intervalo: number = window.setInterval(() => {
  segundos += 1;
  console.log(segundos);
}, 1000);

window.clearInterval(intervalo);
```

### `requestAnimationFrame` / `cancelAnimationFrame`

Pide al navegador que ejecute el callback antes del siguiente repintado. Es la
forma correcta de animar:

```ts
let id: number | null = null;

function animar(tiempo: number): void {
  console.log("Fotograma:", tiempo);
  id = window.requestAnimationFrame(animar);
}

id = window.requestAnimationFrame(animar);

if (id !== null) {
  window.cancelAnimationFrame(id);
}
```

### `queueMicrotask`

Ejecuta una función al final de la tarea actual, antes del siguiente repintado:

```ts
window.queueMicrotask(() => {
  console.log("Microtarea ejecutada");
});
```

### `requestIdleCallback`

Ejecuta código cuando el navegador está inactivo:

```ts
const id = window.requestIdleCallback((deadline) => {
  console.log("Tiempo restante:", deadline.timeRemaining());
});
```

### Diferencias rápidas

| API | Cuándo se ejecuta |
|---|---|
| `setTimeout(f, 0)` | Próxima tarea, después de la tarea actual. |
| `queueMicrotask(f)` | Antes de la próxima tarea y del repintado. |
| `requestAnimationFrame(f)` | Antes del siguiente repintado. |
| `setInterval(f, ms)` | Cada `ms` aproximadamente, sin garantía exacta. |

---

## 8. Navegación: `location`

`window.location` describe la URL actual y permite navegar.

### Propiedades

| Propiedad | Ejemplo | Descripción |
|---|---|---|
| `href` | `https://web.com/a?x=1#top` | URL completa. |
| `protocol` | `https:` | Protocolo. |
| `host` | `web.com:8080` | Host y puerto. |
| `hostname` | `web.com` | Solo el host. |
| `port` | `8080` | Puerto (vacío si es el predeterminado). |
| `pathname` | `/a` | Ruta. |
| `search` | `?x=1` | Query string. |
| `hash` | `#top` | Fragmento. |
| `origin` | `https://web.com` | Origen (`protocolo + host`). |
| `ancestorOrigins` | `DOMStringList` | Orígenes de los marcos contenedores. |

### Métodos

| Método | Descripción |
|---|---|
| `location.assign(url)` | Navega a la URL y añade entrada al historial. |
| `location.replace(url)` | Navega sin añadir entrada al historial. |
| `location.reload()` | Recarga la página actual. |

```ts
window.location.assign("https://example.com");
window.location.replace("https://example.com");
window.location.reload();
```

También se puede navegar asignando `href`:

```ts
window.location.href = "https://example.com";
window.location.hash = "seccion";
window.location.search = "?page=2";
```

### `URL` y `URLSearchParams`

```ts
const url = new URL(window.location.href);

console.log(url.searchParams.get("name"));
console.log(url.searchParams.get("lang"));

url.searchParams.set("lang", "ca");
url.searchParams.append("tag", "typescript");
url.searchParams.delete("page");

history.pushState({}, "", url.href);
```

Ejemplo del Xat:

```ts
const nombre = new URLSearchParams(window.location.search).get("name")
  ?? "DefaultUser";
```

---

## 9. Historial: `history`

### Propiedades

| Propiedad | Descripción |
|---|---|
| `history.length` | Número de entradas del historial. |
| `history.state` | Datos asociados a la entrada actual. |
| `history.scrollRestoration` | `"auto"` o `"manual"`. |

### Métodos

| Método | Descripción |
|---|---|
| `history.back()` | Atrás (equivale a `go(-1)`). |
| `history.forward()` | Adelante (equivale a `go(1)`). |
| `history.go(n)` | Avanza/retrocede `n` entradas. |
| `history.pushState(state, unused, url)` | Añade una entrada nueva. |
| `history.replaceState(state, unused, url)` | Reemplaza la entrada actual. |

```ts
history.pushState({ vista: "a" }, "", "?vista=a");
history.replaceState({ vista: "b" }, "", "?vista=b");

window.addEventListener("popstate", (evento: PopStateEvent) => {
  console.log("Estado:", evento.state);
});

window.addEventListener("hashchange", () => {
  console.log("Hash:", window.location.hash);
});
```

> `pushState`/`replaceState` no recargan la página, pero la URL debe ser del
> mismo origen. Con `file://` algunos navegadores lanzan `SecurityError`; por eso
> conviene servir el proyecto por HTTP.

---

## 10. Pantalla: `screen`

| Propiedad | Descripción |
|---|---|
| `screen.width` / `screen.height` | Resolución total de la pantalla. |
| `screen.availWidth` / `availHeight` | Área disponible (sin barras del sistema). |
| `screen.availLeft` / `availTop` | Coordenadas del área disponible. |
| `screen.colorDepth` | Profundidad de color. |
| `screen.pixelDepth` | Profundidad de píxel. |
| `screen.orientation` | Objeto `ScreenOrientation`. |
| `screen.isExtended` | Varias pantallas (experimental). |

```ts
console.log(screen.width, screen.height);
console.log(screen.availWidth, screen.availHeight);

screen.orientation.addEventListener("change", () => {
  console.log(screen.orientation.type, screen.orientation.angle);
});

await screen.orientation.lock("landscape");
screen.orientation.unlock();
```

---

## 11. Navegador: `navigator`

| Propiedad / método | Descripción |
|---|---|
| `navigator.userAgent` | Cadena de identificación del navegador. |
| `navigator.language` / `languages` | Idioma preferido. |
| `navigator.platform` | Plataforma (obsoleto en algunos casos). |
| `navigator.onLine` | `true` si hay conexión de red. |
| `navigator.cookieEnabled` | Cookies habilitadas. |
| `navigator.hardwareConcurrency` | Núcleos lógicos disponibles. |
| `navigator.maxTouchPoints` | Puntos táctiles. |
| `navigator.pdfViewerEnabled` | Visor PDF integrado. |
| `navigator.webdriver` | Controlado por automatización. |
| `navigator.clipboard` | Portapapeles. |
| `navigator.geolocation` | Geolocalización. |
| `navigator.mediaDevices` | Cámara y micrófono. |
| `navigator.permissions` | Estado de permisos. |
| `navigator.serviceWorker` | Service workers. |
| `navigator.storage` | Estimación y persistencia. |
| `navigator.connection` | Información de red (experimental). |
| `navigator.userAgentData` | Client Hints (experimental). |

### Ejemplos

```ts
// Portapapeles
await navigator.clipboard.writeText("Texto copiado");

const texto: string = await navigator.clipboard.readText();

// Geolocalización
navigator.geolocation.getCurrentPosition(
  (posicion: GeolocationPosition) => {
    console.log(posicion.coords.latitude, posicion.coords.longitude);
  },
  (error: GeolocationPositionError) => {
    console.error(error.message);
  },
  { enableHighAccuracy: true, timeout: 10_000 }
);

// Permisos
const estado = await navigator.permissions.query({
  name: "geolocation",
});
console.log(estado.state); // "granted" | "denied" | "prompt"
```

### `sendBeacon`

Envía datos al servidor de forma asíncrona, incluso al cerrar la página:

```ts
navigator.sendBeacon("/analytics", JSON.stringify({ evento: "salida" }));
```

---

## 12. Comunicación entre ventanas

### `window.postMessage()`

```ts
window.postMessage(message: any, targetOrigin: string, transfer?: Transferable[])
```

```ts
// Ventana A (padre)
const hija = window.open("hija.html", "hija");

hija?.postMessage(
  { tipo: "saludo", texto: "Hola desde el padre" },
  "*" // en producción: "https://midominio.com"
);

window.addEventListener("message", (evento: MessageEvent<unknown>) => {
  // Validar siempre la fuente y el origen
  if (evento.source !== hija) return;
  if (evento.origin !== "https://midominio.com") return;

  console.log("Mensaje de la hija:", evento.data);
});
```

```ts
// Ventana B (hija)
const padre = window.opener as Window | null;

window.addEventListener("message", (evento: MessageEvent<unknown>) => {
  if (evento.source !== padre) return;

  console.log("Mensaje del padre:", evento.data);

  padre?.postMessage({ tipo: "respuesta", texto: "Hola padre" }, "*");
});
```

### Campos de `MessageEvent`

| Campo | Descripción |
|---|---|
| `evento.data` | Datos enviados (pueden ser objetos, arrays, etc.). |
| `evento.origin` | Origen de la ventana que envió el mensaje. |
| `evento.source` | Referencia a la ventana que lo envió. |
| `evento.ports` | Puertos de `MessageChannel`. |

### `BroadcastChannel`

Alternativa moderna para comunicar pestañas del **mismo origen**:

```ts
const canal = new BroadcastChannel("mi-canal");

canal.postMessage({ tipo: "mensaje", texto: "Hola" });

canal.addEventListener("message", (evento: MessageEvent<unknown>) => {
  console.log(evento.data);
});

canal.close();
```

> `BroadcastChannel` no sirve para ventanas de distinto origen.
> `postMessage` sí, pero hay que validar `origin` y `source`.

---

## 13. Eventos de `window`

### Eventos más importantes

| Evento | Se dispara cuando… |
|---|---|
| `DOMContentLoaded` | El HTML se ha parseado (en `document`). |
| `load` | Todos los recursos han terminado de cargar. |
| `beforeunload` | La página está a punto de cerrarse o recargarse. |
| `unload` | La página se está descargando (poco fiable). |
| `pageshow` | La página aparece (incluida la caché de retroceso). |
| `pagehide` | La página desaparece. |
| `resize` | Cambia el tamaño de la ventana. |
| `scroll` | El documento se desplaza. |
| `focus` / `blur` | La ventana gana o pierde el foco. |
| `online` / `offline` | Cambia la conectividad. |
| `popstate` | Cambia la entrada del historial. |
| `hashchange` | Cambia el fragmento de la URL. |
| `storage` | Otra pestaña modifica `localStorage`/`sessionStorage`. |
| `message` | Llega un mensaje de `postMessage`. |
| `messageerror` | Un mensaje no se puede deserializar. |
| `visibilitychange` | Cambia la visibilidad de la pestaña (en `document`). |
| `fullscreenchange` | Cambia el modo pantalla completa (en `document`). |
| `error` | Error de carga o de script. |
| `unhandledrejection` | Promesa rechazada sin `catch`. |
| `rejectionhandled` | Se maneja una promesa que antes no lo estaba. |
| `languagechange` | Cambia el idioma preferido. |
| `beforeprint` / `afterprint` | Antes/después de imprimir. |

### Ejemplos

```ts
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM listo");
});

window.addEventListener("load", () => {
  console.log("Todo cargado");
});

window.addEventListener("resize", () => {
  console.log(window.innerWidth, window.innerHeight);
});

window.addEventListener("scroll", () => {
  console.log(window.scrollY);
}, { passive: true });

window.addEventListener("online", () => {
  console.log("Conexión recuperada");
});

window.addEventListener("offline", () => {
  console.log("Sin conexión");
});

document.addEventListener("visibilitychange", () => {
  console.log(document.visibilityState); // "visible" | "hidden"
});
```

### `beforeunload`

```ts
let hayCambios = true;

window.addEventListener("beforeunload", (evento: BeforeUnloadEvent) => {
  if (!hayCambios) return;

  evento.preventDefault();
  evento.returnValue = "Hay cambios sin guardar.";
});
```

> Los navegadores modernos muestran su propio mensaje genérico; no se puede
> personalizar el texto.

### `pageshow` / `pagehide`

```ts
window.addEventListener("pageshow", (evento: PageTransitionEvent) => {
  console.log("pageshow, desde caché:", evento.persisted);
});

window.addEventListener("pagehide", (evento: PageTransitionEvent) => {
  console.log("pagehide, desde caché:", evento.persisted);
});
```

---

## 14. `localStorage` y `sessionStorage`

### Qué son

`localStorage` y `sessionStorage` son dos objetos `Storage` que guardan pares
clave-valor **en el navegador**, por **origen** (`protocolo + host + puerto`).

| Característica | `localStorage` | `sessionStorage` |
|---|---|---|
| Persiste al cerrar el navegador | Sí | No |
| Se comparte entre pestañas | Sí (mismo origen) | No (cada pestaña) |
| Capacidad típica | ~5 MB | ~5 MB |
| Tipo de valores | Solo `string` | Solo `string` |
| Acceso | Sincrónico | Sincrónico |
| Se borra al limpiar datos | Sí | Sí |
| Evento `storage` | Sí | Sí |

> Matiz: el evento `storage` de `sessionStorage` solo se propaga dentro de la
> misma pestaña (por ejemplo, entre iframes que comparten esa sesión), no a
> otras pestañas. El de `localStorage` sí llega a las demás pestañas del mismo
> origen.

### API completa de `Storage`

| Miembro | Firma | Descripción |
|---|---|---|
| `length` | `number` | Número de claves guardadas. |
| `key(indice)` | `string \| null` | Clave en la posición `indice` (0…length-1). |
| `getItem(clave)` | `string \| null` | Valor de la clave o `null`. |
| `setItem(clave, valor)` | `void` | Guarda/actualiza un valor (siempre string). |
| `removeItem(clave)` | `void` | Elimina una clave. |
| `clear()` | `void` | Elimina todas las claves del origen. |

```ts
// Guardar
localStorage.setItem("nombre", "Joan");
localStorage.setItem("edad", "20");

// Leer
const nombre = localStorage.getItem("nombre"); // "Joan" | null
const edad = localStorage.getItem("edad");     // "20" | null

// Eliminar una clave
localStorage.removeItem("edad");

// Vaciar todo
localStorage.clear();

// Recorrer las claves
for (let i = 0; i < localStorage.length; i += 1) {
  const clave = localStorage.key(i);

  if (clave !== null) {
    console.log(clave, localStorage.getItem(clave));
  }
}
```

### Guardar objetos: `JSON.stringify` / `JSON.parse`

`localStorage` solo acepta strings. Para guardar objetos hay que serializarlos:

```ts
interface Usuario {
  nombre: string;
  edad: number;
  activo: boolean;
}

const usuario: Usuario = {
  nombre: "Joan",
  edad: 20,
  activo: true,
};

localStorage.setItem("usuario", JSON.stringify(usuario));

const guardado = localStorage.getItem("usuario");

if (guardado !== null) {
  const recuperado = JSON.parse(guardado) as Usuario;
  console.log(recuperado.nombre);
}
```

Helpers tipados y seguros:

```ts
function guardar<T>(clave: string, valor: T): void {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function leer<T>(clave: string): T | null {
  const texto = localStorage.getItem(clave);

  if (texto === null) {
    return null;
  }

  try {
    return JSON.parse(texto) as T;
  } catch {
    console.error(`El valor de "${clave}" no es JSON válido`);
    return null;
  }
}

guardar<Usuario>("usuario", usuario);
const recuperado = leer<Usuario>("usuario");
```

### El evento `storage`

Se dispara en **las otras pestañas/ventanas** del mismo origen cuando una
modifica el almacenamiento. **No se dispara en la propia pestaña que hace el
cambio.**

```ts
window.addEventListener("storage", (evento: StorageEvent) => {
  console.log("clave:", evento.key);
  console.log("valor anterior:", evento.oldValue);
  console.log("valor nuevo:", evento.newValue);
  console.log("URL que cambió:", evento.url);
  console.log("almacén:", evento.storageArea);
});
```

| Propiedad | Descripción |
|---|---|
| `key` | Clave modificada, o `null` si se ejecutó `clear()`. |
| `oldValue` | Valor anterior, o `null` si no existía. |
| `newValue` | Valor nuevo, o `null` si se eliminó la clave. |
| `url` | URL del documento que hizo el cambio. |
| `storageArea` | `localStorage` o `sessionStorage`. |

Ejemplo de sincronización entre pestañas:

```ts
window.addEventListener("storage", (evento: StorageEvent) => {
  if (evento.storageArea !== localStorage) return;
  if (evento.key !== "tema") return;

  document.body.dataset.tema = evento.newValue ?? "claro";
});
```

### `sessionStorage`

Misma API, pero los datos viven solo en la pestaña actual:

```ts
sessionStorage.setItem("paso", "2");
const paso = sessionStorage.getItem("paso");
sessionStorage.removeItem("paso");
sessionStorage.clear();
```

Es útil para asistentes multi-paso, filtros temporales o datos que no deben
compartirse entre pestañas.

### Limitaciones y seguridad

- Solo strings: usa JSON para objetos; para binarios, Base64 o IndexedDB.
- Capacidad limitada (unos 5 MB por origen).
- Es sincrónico: operaciones grandes bloquean el hilo principal.
- No es seguro para secretos: cualquier script del origen puede leerlo.
- Es vulnerable a XSS. Nunca guardes tokens sensibles si puedes evitarlo.
- No todos los navegadores permiten `localStorage` en modo privado o con
  cookies bloqueadas; puede lanzar `SecurityError`.
- En `file://` el origen es opaco y el comportamiento entre ventanas cambia.
- Dos pestañas pueden sobrescribirse; no es una base de datos transaccional.

---

## 15. El ejercicio Xat explicado

El Xat es un chat local entre una ventana **Admin** y dos ventanas de
**usuario**. No hay servidor: la comunicación se hace con `localStorage` y el
evento `storage`. Es un buen ejemplo de combinación de `window.open`,
`URLSearchParams`, `localStorage`, `JSON` y eventos.

### Archivos

```
Xat/
├── index.html      # ventana Admin
├── user.html       # ventana de usuario
├── tipus.ts        # interface Message
├── admin.ts        # lógica del Admin
└── user.ts         # lógica del usuario
```

### El tipo `Message`

```ts
export interface Message {
  id: number;
  user: string;
  text: string;
  type: "message" | "clear";
}
```

- `id`: marca temporal (`Date.now()`). Sirve para que cada mensaje sea distinto.
- `user`: nombre del emisor.
- `text`: contenido del mensaje.
- `type`: `"message"` para un mensaje normal, `"clear"` para vaciar el chat.

### Claves de `localStorage`

| Clave | Quién escribe | Quién escucha | Significado |
|---|---|---|---|
| `inbox` | Usuarios | Admin | Mensaje de un usuario hacia el Admin. |
| `broadcast` | Admin | Usuarios | Mensaje del Admin hacia todos. |

Flujo:

```
Usuario  --setItem("inbox", msg)-->  evento storage  -->  Admin
Admin    --setItem("broadcast", msg)--> evento storage --> Usuarios
Admin    (se muestra a sí mismo el mensaje directamente)
```

### `user.ts`: funciones del usuario

#### Obtener el nombre de la URL

```ts
const nom = new URLSearchParams(window.location.search).get("name")
  || "DefaultUser";

h2.textContent = nom;
document.title = nom;
```

La ventana se abre como `user.html?name=Usuari1`, y `URLSearchParams` lee el
parámetro `name`.

#### Escuchar los mensajes del Admin

```ts
window.addEventListener("storage", (e) => {
  if (e.key !== "broadcast") {
    return;
  }

  if (e.newValue === null) {
    return;
  }

  const msg = JSON.parse(e.newValue) as Message;

  if (msg.type === "clear") {
    chat.value = "";
  }

  if (msg.type === "message") {
    const newline = `${msg.user}: ${msg.text}`;

    if (chat.value !== "") {
      chat.value = newline + "\n" + chat.value;
    } else {
      chat.value = newline;
    }
  }
});
```

Puntos importantes:

- Solo procesa la clave `broadcast`.
- `e.newValue === null` significa que la clave se eliminó.
- El mensaje llega como string JSON y se convierte con `JSON.parse`.
- `clear` vacía el textarea; `message` se añade **arriba** del historial.
- El usuario que envía no recibe su propio mensaje hasta que el Admin lo
  retransmite.

#### Enviar un mensaje

```ts
function enviar() {
  if (messageInput.value.trim() === "") {
    return;
  }

  const msg: Message = {
    id: Date.now(),
    user: nom,
    text: messageInput.value.trim(),
    type: "message",
  };

  localStorage.setItem("inbox", JSON.stringify(msg));

  messageInput.value = "";
  messageInput.focus();
}

sendButton.addEventListener("click", enviar);
```

- Valida que no se envíe un mensaje vacío.
- Construye el objeto `Message`.
- Lo serializa y lo guarda en `inbox`.
- El Admin lo recibirá mediante el evento `storage`.
- Limpia el campo y devuelve el foco.

### `admin.ts`: funciones del Admin

#### Referencias a las ventanas

```ts
const finestres: (Window | null)[] = [null, null];
```

Un array con las dos ventanas de usuario. `null` significa que aún no se ha
abierto o que el navegador bloqueó el popup.

#### `obrirFinestres(index)`

```ts
function obrirFinestres(index: number) {
  const width = Math.floor(screen.availWidth / 2);
  const height = Math.floor(screen.availHeight / 2);
  const left = Math.floor(screen.availWidth / 2);
  const top = index * height;

  const url = `user.html?name=Usuari${index + 1}`;
  const features = `width=${width},height=${height},left=${left},top=${top}`;

  finestres[index] = window.open(url, "user" + index, features);
}
```

- Divide la pantalla en dos mitades: el Admin ocupa la izquierda y cada usuario
  una mitad de la derecha.
- `index = 0` → arriba; `index = 1` → abajo.
- El nombre de ventana `user0`/`user1` evita duplicados.
- Guarda la referencia devuelta por `window.open`.

#### `obrirFinestresTancades()`

```ts
function obrirFinestresTancades() {
  for (let i = 0; i <= 1; ++i) {
    if (finestres[i] === null || finestres[i]?.closed) {
      obrirFinestres(i);
    }
  }
}
```

- Recorre las dos posiciones.
- Solo abre las que no existen (`null`) o están cerradas (`closed === true`).
- Se llama al arrancar y al limpiar el chat.

#### `afegirMissatge(msg)`

```ts
function afegirMissatge(msg: Message) {
  if (msg.type === "clear") {
    chat.value = "";
  }

  if (msg.type === "message") {
    const newline = `${msg.user}: ${msg.text}`;

    if (chat.value !== "") {
      chat.value = newline + "\n" + chat.value;
    } else {
      chat.value = newline;
    }
  }
}
```

Es la misma lógica de visualización que en `user.ts`, pero reutilizada para los
mensajes del Admin y los de los usuarios.

#### `netejarXat()`

```ts
function netejarXat() {
  // El Admin no recibe su propio evento "storage", así que se borra a mano
  chat.value = "";

  const clearmsg: Message = {
    id: Date.now(), // id nuevo para que el evento salte en los usuarios
    type: "clear",
    user: "",
    text: "",
  };

  localStorage.setItem("broadcast", JSON.stringify(clearmsg));

  obrirFinestresTancades();
}
```

- Borra el textarea del Admin directamente.
- Crea un mensaje `clear` con un `id` nuevo.
- Lo publica en `broadcast` para que los usuarios vacíen el suyo.
- Reabre las ventanas que se hayan cerrado.
- El `id` nuevo es importante: si se guardara exactamente el mismo string,
  algunos navegadores podrían no disparar el evento `storage`.

#### `enviar()` del Admin

```ts
function enviar() {
  const text = messageInput.value.trim();

  if (text === "") {
    return;
  }

  const msg: Message = {
    id: Date.now(),
    user: nom,
    text: text,
    type: "message",
  };

  afegirMissatge(msg); // se muestra a sí mismo directamente
  localStorage.setItem("broadcast", JSON.stringify(msg));

  messageInput.value = "";
  messageInput.focus();
}
```

- El Admin muestra el mensaje **directamente**, porque el evento `storage` no
  se dispara en la misma pestaña que hace el cambio.
- Después lo publica en `broadcast` para los usuarios.

#### Escuchar los mensajes de los usuarios

```ts
window.addEventListener("storage", (e) => {
  if (e.key !== "inbox") {
    return;
  }

  if (e.newValue === null) {
    return;
  }

  const msg = JSON.parse(e.newValue) as Message;

  afegirMissatge(msg);
  localStorage.setItem("broadcast", JSON.stringify(msg));
});
```

- Escucha `inbox` (mensajes de usuarios).
- Los muestra en el chat del Admin.
- Los retransmite a `broadcast` para que lleguen a todos los usuarios.

#### Botones de parar y limpiar

```ts
stop1.addEventListener("click", () => {
  finestres[0]?.close();
});

stop2.addEventListener("click", () => {
  finestres[1]?.close();
});

clearButton.addEventListener("click", netejarXat);
```

- `finestres[0]?.close()` cierra la ventana superior si existe.
- `clearButton` lanza `netejarXat()`.

#### Arranque

```ts
obrirFinestresTancades();
```

Al cargar `admin.ts` se abren automáticamente las dos ventanas de usuario. El
navegador puede bloquear los popups si no hay interacción del usuario; por eso
conviene abrir el Admin con un clic o permitir popups para el sitio.

### Resumen del protocolo del Xat

```ts
// Usuario → Admin
localStorage.setItem("inbox", JSON.stringify({
  id: Date.now(),
  user: "Usuari1",
  text: "Hola",
  type: "message",
}));

// Admin → todos
localStorage.setItem("broadcast", JSON.stringify({
  id: Date.now(),
  user: "Admin",
  text: "Hola a todos",
  type: "message",
}));

// Admin → todos (vaciar)
localStorage.setItem("broadcast", JSON.stringify({
  id: Date.now(),
  user: "",
  text: "",
  type: "clear",
}));
```

### Limitaciones del Xat (y cómo mejorarlo)

1. **Solo hay un valor `inbox`**: si dos usuarios escriben a la vez, el segundo
   sobrescribe al primero y se puede perder un mensaje. Una cola real necesita
   un array o un servidor.
2. **No hay historial persistente**: el textarea se pierde al recargar. Podrías
   guardar el historial en `localStorage` como array.
3. **`JSON.parse` puede fallar** si el valor está corrupto. Añade `try/catch`.
4. **No se filtra por `storageArea`**: comprueba
   `e.storageArea === localStorage` si usas también `sessionStorage`.
5. **Seguridad**: `localStorage` es accesible para cualquier script del origen.
   No guardes contraseñas ni tokens.
6. **Producción**: usa WebSocket o `BroadcastChannel` para comunicación en
   tiempo real; `localStorage` no es un bus de mensajes.
7. **`id` no se usa para deduplicar**: se podría comprobar que el `id` sea mayor
   que el último procesado para evitar mensajes repetidos.

---

## 16. Chuleta rápida

```ts
// Abrir y controlar ventanas
const ventana = window.open("hija.html", "hija", "width=600,height=400");
ventana?.focus();
ventana?.moveTo(100, 100);
ventana?.resizeTo(800, 600);
ventana?.close();
console.log(ventana?.closed);

// Referencias
window.opener;
window.parent;
window.top;
window.self;

// Tamaño y scroll
window.innerWidth;
window.innerHeight;
window.scrollY;
window.scrollTo({ top: 0, behavior: "smooth" });

// Diálogos
window.alert("Hola");
const ok = window.confirm("¿Sí?");
const texto = window.prompt("Nombre", "Joan");

// Timers
const t = window.setTimeout(() => {}, 1000);
window.clearTimeout(t);

const i = window.setInterval(() => {}, 1000);
window.clearInterval(i);

const r = window.requestAnimationFrame(() => {});
window.cancelAnimationFrame(r);

// location
window.location.href;
window.location.search;
window.location.hash;
window.location.reload();

// history
history.pushState({}, "", "?page=2");
history.back();
history.forward();
history.go(-1);

// postMessage
ventana?.postMessage({ tipo: "hola" }, "*");

window.addEventListener("message", (e: MessageEvent<unknown>) => {
  console.log(e.data, e.origin, e.source);
});

// localStorage
localStorage.setItem("clave", JSON.stringify({ a: 1 }));
const valor = localStorage.getItem("clave");
const objeto = valor === null ? null : JSON.parse(valor);
localStorage.removeItem("clave");
localStorage.clear();

// storage entre pestañas
window.addEventListener("storage", (e: StorageEvent) => {
  console.log(e.key, e.oldValue, e.newValue, e.url, e.storageArea);
});

// Eventos de ciclo de vida
window.addEventListener("DOMContentLoaded", () => {});
window.addEventListener("load", () => {});
window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
  e.preventDefault();
  e.returnValue = "";
});
document.addEventListener("visibilitychange", () => {
  console.log(document.visibilityState);
});
```

---

## 17. Errores comunes y buenas prácticas

### Errores comunes

- Usar `file://` con módulos ES: los `import` fallan por CORS.
- Esperar que `window.open()` siempre devuelva una ventana: puede devolver
  `null` si el popup está bloqueado.
- No comprobar `closed` antes de usar una referencia a una ventana.
- Usar `localStorage` para secretos o datos sensibles.
- Guardar objetos directamente: `localStorage` convierte todo a string.
- Olvidar `JSON.parse`/`JSON.stringify`.
- Suponer que el evento `storage` se dispara en la misma pestaña.
- No validar `event.origin` ni `event.source` en `postMessage`.
- Usar `innerHTML` con datos del usuario (XSS). Prefiere `textContent`.
- Asumir que `moveTo`/`resizeTo` funcionan siempre.
- Usar `setInterval` sin `clearInterval` (fugas de memoria y timers activos).
- No cancelar `requestAnimationFrame` al salir de la vista.

### Buenas prácticas

- Sirve siempre por HTTP/HTTPS, incluso en desarrollo (`localhost`).
- Comprueba `window.open(...) === null` y avisa al usuario.
- Usa nombres de ventana para reutilizar popups.
- Valida `event.origin` con una lista blanca en `postMessage`.
- Usa `try/catch` alrededor de `JSON.parse` y de las APIs de almacenamiento.
- Serializa con JSON y tipa los datos con interfaces.
- Guarda en `localStorage` solo datos no sensibles.
- Usa `sessionStorage` para estado temporal de la pestaña.
- Usa `BroadcastChannel` para comunicación entre pestañas del mismo origen.
- Usa `requestAnimationFrame` para animaciones.
- Limpia timers y listeners cuando ya no sean necesarios.
- Documenta las claves de `localStorage` y su formato.
- En producción, usa un backend/WebSocket para chats y datos compartidos.

---

## Referencias

- MDN: [`Window`](https://developer.mozilla.org/es/docs/Web/API/Window)
- MDN: [`localStorage`](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- MDN: [`Storage`](https://developer.mozilla.org/es/docs/Web/API/Storage)
- MDN: [`Window.postMessage`](https://developer.mozilla.org/es/docs/Web/API/Window/postMessage)
- MDN: [`BroadcastChannel`](https://developer.mozilla.org/es/docs/Web/API/BroadcastChannel)
- MDN: [`History`](https://developer.mozilla.org/es/docs/Web/API/History)
- MDN: [`Location`](https://developer.mozilla.org/es/docs/Web/API/Location)
