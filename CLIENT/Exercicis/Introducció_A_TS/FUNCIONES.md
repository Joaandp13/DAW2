# Introducció a TypeScript · DWEC UF1 — Guía de funciones

Documento con **todas las funciones y clases** del proyecto, explicadas y agrupadas por temas, con un resumen de los conceptos clave de cada tema.

## 0. Cómo está organizado el proyecto

```
Introducció_A_TS/
├─ src/                      ← código TypeScript (.ts)
│  ├─ comu/                  (utilidades compartidas)
│  ├─ Llistes/
│  ├─ Objectes/
│  ├─ Funcions/
│  ├─ Mes_funcions/
│  └─ Prototipus_i_classes/
├─ dist/                     ← lo que genera `tsc` (.js y .js.map) + las páginas .html
│  ├─ index.html             (índice con enlaces a todos los temas)
│  ├─ estils.css
│  └─ <mismas carpetas que src>/  (cada tema tiene su .html)
├─ tsconfig.json
├─ package.json
└─ FUNCIONES.md              ← este documento
```

**Cómo usarlo**

1. `npm install` (instala TypeScript) y `npx tsc` (o `npm run build`) compila `src/` → `dist/`. Con `npm run watch` recompila solo al guardar.
2. Abre `dist/index.html` con **Live Server** (VS Code). Los módulos ES (`import`/`export`) **no funcionan con doble clic** (`file://`), necesitan un servidor.
3. Cada tema tiene un `.ts` "de entrada" (`Llistes.ts`, `Objectes.ts`…) que solo conecta los botones del HTML con las funciones; la lógica está en los otros ficheros.

**Cosas que debes saber**

- **Diccionario reducido**: no tengo tu `Diccionari.js` completo, así que `src/Llistes/Diccionari.ts` lleva unas 165 palabras de ejemplo. Sustitúyelo por el tuyo (mientras exporte `diccio.diccionari`, todo sigue funcionando).
- **`aes.js` es un sustituto**: `dist/Mes_funcions/aes.js` solo codifica en Base64 para que la "calculadora del espía" funcione. Pon ahí el `aes.js` real.
- **`Verificar.ts` es propio**: no tengo tus `Verificar.js` / `VerificarCiencies.js` / `VerificarLletres.js`; hice un verificador pequeño (la última prueba falla a propósito para ver el ✖).
- **"Objectes" y "Objectes V2"** son casi el mismo tema (V2 es la versión ampliada), así que están juntos en `Objectes/`.
- **Clientes y facturas** usa `class` en lugar de funciones constructoras (en TypeScript es lo natural; ver explicación en el tema 5).
- Compilado y probado: las funciones puras con pruebas automáticas y las 7 páginas simulando clics en todos los botones, sin errores.

---

## 1. Utilidades comunes (`src/comu/`)

| Función | Qué hace |
|---|---|
| `exercici(id, accion)` (`ui.ts`) | Conecta el botón `#btn-<id>` con una acción. La acción recibe una función `out(texto)` que escribe en la consola y en el `<pre id="out-<id>">`. Si la acción lanza una excepción, muestra el mensaje con ⚠. |
| `exerciciHtml(id, accion)` | Igual, pero la acción **devuelve HTML** que se pone en el `<div id="out-<id>">` (para tablas). |
| `obtenir<T>(id)` | `document.getElementById` pero lanza error si no existe y devuelve ya el tipo correcto (`T extends HTMLElement`), evitando `null`. |
| `escapeHtml(texto)` | Cambia `& < > "` por entidades HTML. Imprescindible antes de meter texto del usuario en `innerHTML`. |
| `cronometrar(f)` | Ejecuta `f` y devuelve los milisegundos que tardó (`performance.now()`). |
| `transformar(texto)` (`text.ts`) | Mayúsculas sin acentos ni diéresis, conservando Ñ y Ç. Usa `normalize("NFD")` (separa la letra de su tilde) y quita las marcas con una expresión regular. |
| `lletraNIF(numero)` / `nifValid(nif)` (`nif.ts`) | La letra del NIF es `"TRWAGMYFPDXBNJZSQVHLCKE"[número % 23]`. `nifValid` comprueba formato (8 cifras + letra) y que la letra sea la correcta. |

**Tipo `Sortida`**: `(texto: string) => void`. Se usa para que las funciones de los ejercicios no dependan del DOM y se puedan probar solas.

---

## 2. Llistes (`src/Llistes/`)

### `Paraules.ts` (ejercicios 1-7)

| Función | Qué hace y por qué |
|---|---|
| `crearArrayParaules(n)` | Devuelve `n` palabras aleatorias del diccionario con `Math.floor(Math.random() * longitud)`. Valida que `n` sea un entero positivo. |
| `eliminarRepetides(paraules, out?)` | **Array sin ordenar.** Para cada posición `i` busca repetidas con `indexOf(valor, i + 1)` (el segundo parámetro dice desde dónde buscar) y las borra con `splice(ndx, 1)`. Devuelve cuántas eliminó. Coste ~O(n²). |
| `eliminarRepetidesOrdenat(paraules, out?)` | **Array ordenado.** Ordena con `sort()` y recorre una sola vez con **dos punteros** (`llegir` y `escriure`): copia al principio solo lo que no es igual a lo último escrito. Coste O(n) tras ordenar. |
| `buscarLineal(array, text)` | Búsqueda lineal con `indexOf`; devuelve posición o `-1`. |
| `buscarBinari(array, text)` | **Búsqueda binaria**: en un array ordenado compara con el elemento central y descarta la mitad cada vez (`min`, `max`, `mid`). Coste O(log n). Exige que el array esté ordenado con el mismo criterio que usan `<` y `>`. |
| `ordenarLenInv(a, b)` | Comparador para `sort()`: primero por longitud creciente (`a.length - b.length`); si empatan, alfabético **inverso**. Un comparador devuelve negativo / 0 / positivo. |
| `cercarPerPatro(patro)` | Convierte `?` en `.` y `*` en `.*` para crear una `RegExp` anclada (`^…$`) y filtra el diccionario. Valida que el patrón solo tenga letras, `?` y `*`. |
| `ex1…ex7(out)` | Envoltorios que ejecutan lo anterior y muestran resultados/tiempos. |

### `Numeros.ts` (ejercicios 8-11)

| Función | Qué hace y por qué |
|---|---|
| `crearArrayNumeros(n)` | `n` enteros entre 0 y 999 999. |
| `esParell` / `esImparell` | Predicados (`n % 2 === 0` / `!== 0`). Se pasan a `filter()`. |
| `separarParellsImparells(numeros)` | Dos `filter()`: devuelve `{ parells, imparells }`. |
| `imparellsAbansParells(numeros)` | Imparells ordenados + `concat` + parells ordenados. **Ojo**: `sort()` sin argumento ordena *como texto* (`"100" < "9"`), por eso se pasa `(a, b) => a - b`. |
| `arrelDigital(n)` | Suma los dígitos repetidamente hasta que queda uno (`[...String(n)]` + `reduce`). |
| `calcularCuriositat(n)` | Según `arrelDigital % 3` suma 21, 29 o 37. Se usa en `map()`. |
| `esMultiple3(n)` | Predicado para `some()` y `every()`. |

> Curiosidad: el resultado de `calcularCuriositat` **siempre** es múltiplo de 3. El número y su raíz digital tienen el mismo resto al dividir entre 3; si ese resto es 1, sumar 29 (resto 2) da resto 0, y si es 2, sumar 37 (resto 1) también; con resto 0, sumar 21 lo mantiene. Por eso `every(esMultiple3)` da `true`.

### Resumen del tema
- **`map`** transforma cada elemento, **`filter`** se queda con los que cumplen una condición, **`some`/`every`** responden "¿alguno?/¿todos?", **`reduce`** acumula.
- **`sort`** ordena *en el sitio* (modifica el array) y por defecto **como texto**.
- Ordenar antes de buscar compensa: la búsqueda binaria y el recorrido de repetidos pasan de O(n²) a O(n log n) o mejor.
- Tipado: `string[]`, `number[]`, funciones con tipos de parámetros y retorno explícitos.

---

## 3. Objectes (`src/Objectes/`)

### `Cerca.ts` — buscadores genéricos (ejercicio 1)
Son **genéricos** (`<T extends object>`): sirven para cualquier tipo de objeto y devuelven el mismo tipo `T`.

| Función | Qué hace |
|---|---|
| `getObjectByValue(array, atribut, valor)` | Primer objeto cuyo atributo vale `valor` (`find`). Devuelve `T \| undefined`. Usa `===` (estricto). |
| `getObjectsByValue(array, atribut, valor)` | Todos los que lo cumplen (`filter`). |
| `getObjectsByPattern(array, atribut, patro)` | Atributos de texto que **contienen** el patrón (`?` = una letra, `*` = varias). Escapa antes los caracteres especiales de RegExp y es insensible a mayúsculas. |
| `getObjectsInRange(array, atribut, min, max)` | Atributos numéricos entre `min` y `max` (inclusive). |

### `Botiga.ts` — clientes y supermercado (ejercicios 2-3)
| Elemento | Qué hace |
|---|---|
| `interface Client`, `interface Article` | Describen la forma de los objetos. En `Article`, `pes?`, `volum?`, `unitats?`, `dte?` son **opcionales** (`?`). |
| `taulaClients(llista)` | Genera la tabla HTML con encabezados recorriendo una lista de pares `[clave, título]`. |
| `etiqueta(article)` | Recorre `Object.entries(a)` y añade sufijos (` g`, ` l`, ` %`, ` €`); si hay `dte`, calcula `preuFinal`. |
| `etiquetes(llista)` | Une todas las etiquetas con una línea en blanco. |

### `Expedients.ts` — alumnos (ejercicio 4)
| Función | Qué hace |
|---|---|
| `crearExpedients()` | Crea 3 alumnos y 3 clones modificados. Usa **`structuredClone`** (copia profunda; `{...obj}` solo copia el primer nivel). |
| `calcularMitjanes(expedients)` | `notaModul` solo si todas las UF ≥ 5 (`every`); `notaFinal` solo si tiene nota de **todos** los módulos del ciclo. |
| `ordenarAlumnes(a1, a2)` | Comparador: apellidos y, si empatan, nombre (`localeCompare` respeta acentos e idioma). `a || b` aprovecha que `0` es falso. |
| `taulaAlumnes(llista)` | Tabla HTML de **cualquier** lista (completa o filtrada). |
| `matriculatsEn`, `noMatriculatsEn`, `graduats` | Filtros con `filter()`. |

### `Cotxe.ts` — coche autónomo (ejercicio 5)
- `interface SensorsCotxe` (luz, túnel, lluvia, semáforo, curva, combustible, límite, vehículo delante, obstáculo).
- `escenaris`: situaciones de prueba.
- `programaCotxe(sensors)`: **programa de control** que devuelve la lista de órdenes para los actuadores (luces, limpiaparabrisas, velocidad objetivo = el mínimo de límite, lluvia, vehículo de delante, curva…, freno de emergencia con prioridad máxima).

### `Domotica.ts` — casa domótica (ejercicio 6)
| Elemento | Qué hace |
|---|---|
| `crearDomotica(missatge)` | **Factoría**: crea sensores, actuadores y funciones; devuelve `{ sensors, actuadors, buscarSensor, buscarActuador, programa }`. |
| `buscarSensor<K>(nom)` / `buscarActuador<K>(nom)` | Buscan por nombre. `K extends keyof Sensors/Actuadors` hace que TypeScript sepa el tipo exacto del valor devuelto (`"pluja"` → `boolean`, `"termometre"` → `number`). |
| Actuadores `persianes`, `termostat`, `llums` | Objetos con estado y métodos (`this`) que muestran un mensaje solo cuando **cambia** el estado. |
| `programa()` | Lee los sensores y decide: lluvia → bajar persianas; temp < 20 → calefacción; > 25 → aire; presencia → luz de cada habitación. Se ejecuta cada segundo con `setInterval`. |

### Resumen del tema
- Un objeto es un conjunto de pares clave/valor; en TS se describe con **`interface`/`type`**.
- **Genéricos** (`<T>`) = "funciona con cualquier tipo manteniendo la información del tipo".
- **Opcionales** (`?`), **unión** (`1 | 2`, `"verd" | "vermell"`), **`unknown`** en lugar de `any` para forzar comprobaciones.
- `Object.entries`, `structuredClone`, `filter/find/every/reduce` son las herramientas habituales con arrays de objetos.

---

## 4. Funcions (`src/Funcions/`)

### `Basiques.ts` (ejercicios 1-4)
| Función | Qué hace |
|---|---|
| `preuFinal(base, dte, iva, num)` | Precio con descuento e IVA. Con `num = true` devuelve número (`108.9`); con `false`, texto en moneda local (`"1089,00 €"`, vía `toLocaleString("es-ES", {style:"currency", currency:"EUR"})`). Devuelve `undefined` si algún dato no es numérico. Usa **sobrecarga de funciones**: TypeScript sabe que `true` → `number` y `false` → `string`. |
| `funcioAmbRetard(funcio, segons, ...args)` | Ejecuta otra función tras un retraso con `setTimeout`. Es genérica (`A extends unknown[]`) para que los `args` se comprueben contra los parámetros de `funcio`. |
| `calcularMitjana(...valors)` | **Parámetro rest** (`...valors`): recoge todos los argumentos en un array (sustituye a `arguments`). Ignora lo que no sea número. |
| `pi(decimals = 100)` | Calcula π con **`BigInt`** y la fórmula de Machin `π = 4·(4·arctan(1/5) − arctan(1/239))`. Trabaja con enteros enormes (número × 10^decimales) y usa 10 cifras extra de "guarda" para evitar errores de redondeo. El **parámetro por defecto** (`= 100`) se aplica si no se pasa nada. |
| `arctanInvers(d, digits)` *(interna)* | Serie de Taylor de `arctan(1/d)` con enteros BigInt. |

### `Paraules.ts` (ejercicios 6-7)
| Función | Qué hace |
|---|---|
| `anagrames(w)` | Dos palabras son anagramas si tienen las **mismas letras ordenadas**. Calcula esa "clave" de `w` y filtra el diccionario por longitud y clave. |
| `paraulesAmb(lletres)` | Palabras **más largas** que se pueden formar con unas letras. Cuenta las letras disponibles en un `Map` y comprueba que cada palabra no necesite más repeticiones de las que hay. |
| `comptarLletres`, `esPotFer` *(internas)* | Ayudantes del anterior. |

### `FraseOculta.ts` (ejercicio 5)
| Función | Qué hace |
|---|---|
| `frasesValides(frases)` | Solo admite frases con **todas** las palabras en el diccionario (`Set` para buscar rápido). |
| `novaPartida()` | Elige una frase al azar y crea el estado `{ frase, dites, endevinada }`. |
| `mostrarFrase(estat)` | Letras ocultas con `?` y espacios con `_`. |
| `dirLletra(estat, lletra)` | Registra una letra (validada con `transformar`) y devuelve cuántas veces sale. |
| `endevinar(estat, intent)` | Intento de adivinar la frase entera. |
| `completada(estat)` | `true` si ya están todas las letras. |
| `ajudaCompletar(estat)` | El ordenador intenta resolver **solo si está completamente seguro**: para cada palabra busca candidatas en el diccionario que coincidan con las letras visibles y cuyas letras ocultas **no** estén entre las ya dichas; si cada palabra tiene **exactamente una** candidata devuelve la frase, si no `null`. |

### Resumen del tema
- Parámetros: **por defecto**, **opcionales** (`?`), **rest** (`...x`).
- **Sobrecargas** para que el tipo de retorno dependa de los argumentos.
- Funciones como valores: se pasan como parámetro (`funcioAmbRetard`) y se devuelven.
- **`BigInt`** (`10n`, `**`, `/`) para enteros sin límite; no se puede mezclar con `number`.
- Los diccionarios y búsquedas por "clave canónica" (letras ordenadas, conteo de letras) evitan comparar todo con todo.

---

## 5. Més funcions (`src/Mes_funcions/`)

### `Executar.ts` (ejercicios 1-2): ejecutar funciones por su nombre
| Función | Qué hace |
|---|---|
| `crearRegistre(out)` | Devuelve un objeto `Record<string, función>` con `ex1…ex4` y `calcularMitjana`. En JS clásico se hacía `window["ex1"]()`; en **módulos TypeScript las funciones no son globales**, así que se guardan en un objeto y se llaman por clave. |
| `executarNom(out)` | Bucle que construye `"ex" + i` y llama a la función con `registre[nom]()` y con `.call(null)`. |
| `executarParamVars(out)` | 10 veces: array de 3-6 notas aleatorias (1-10), llama a `calcularMitjana` **por nombre**, muestra la media con 1 decimal y al final la media total con 2 (`toFixed`). |
| `calcularMitjana(notes)` | Media de un array. |

### `Verificar.ts` (ejercicio 3): mini verificador
| Función | Qué hace |
|---|---|
| `verificar(nom, obtingut, esperat)` | Compara dos valores (con `JSON.stringify`, válido para arrays/objetos simples) y devuelve un `ResultatProva`. |
| `informe(proves, out)` | Muestra ✔/✖ por prueba y el total. |
| `executarProves()` | Lista de pruebas de `preuFinal`, `calcularMitjana`, `comptador` y del mini ejercicio opcional `invertirParaules`. |
| `invertirParaules(frase)` | Mini ejercicio opcional: invierte el orden de las palabras. |

### `ExpedientsFuncional.ts` (ejercicio 4): anónimas, lambdas y clausuras
| Elemento | Tipo | Qué hace |
|---|---|---|
| `totesAprovades` | función **anónima** (`function (m) {…}`) | `!m.notes.some(n => n < 5)` |
| `sumarNotes` | función **anónima** | suma con `reduce` |
| `totsModulsAprovats` | **lambda** (`=>`) | ¿todos los módulos tienen nota? |
| `sumarNotesModuls` | **lambda** | suma las notas de los módulos |
| `filtrarModul(nomModul, matriculat)` | **clausura** | Devuelve una función que "recuerda" `nomModul` y `matriculat`; se pasa a `filter()`. |
| `calcularFuncional`, `demoExpedients` | | Calculan notas con lo anterior y muestran tablas. |

### `Comptador.ts` (ejercicio 5): clausura con estado privado
`comptador(ini, inc, inf?, sup?)` devuelve `{ finc, fdec, limit, set }`:
- `finc()` / `fdec()`: suman/restan `inc` y devuelven el valor, **siempre dentro de los límites** (`Math.min(Math.max(valor, inferior), superior)`).
- `limit(inf, sup)`: cambia los límites; si están al revés, los **intercambia** (`[a, b] = [b, a]`).
- `set(ini?, inc?)`: cambia valor y/o incremento.
- Valida que sean enteros y que `inc > 0`. Las variables `valor`, `increment`, `inferior`, `superior` **solo existen dentro de la clausura**: cada contador es independiente y nadie puede tocarlas desde fuera.

### `Espia.ts` (ejercicio 6): cifrado con caché
| Función | Qué hace |
|---|---|
| `extreureParaules(frase)` | Normaliza (`transformar`), sustituye todo lo que no sea `A-Z0-9ÇÑ` por espacios (`/[^A-Z0-9ÇÑ]+/g`) y divide en palabras. |
| `encriptar(s)` | Cifra cada palabra con `AES.encrypt`, **memorizando** en un `Map` (palabra → código + veces cifrada). |
| `desencriptar(s)` | Descifra cada código con caché; si `AES.decrypt` lanza excepción, la captura (`try/catch`) y la muestra con `alert()`. |
| `neteja()` | **Opcional**: borra de la caché las palabras cifradas una sola vez y devuelve el top 10 `PALABRA (N)`. |
| `compararTemps(frase, repeticiones)` | Mide el tiempo de cifrar muchas veces **con y sin** caché. |
| `declare const AES` | Le dice a TypeScript que existe un `AES` global (viene del script `aes.js`). |

### `MesFuncions.ts` (ejercicio 7)
Todo el código de inicialización está dentro de una **IIFE**: `(function () { … })();`, una función anónima que se ejecuta al definirse y evita ensuciar el ámbito global. (Los módulos ES ya tienen ámbito propio, pero así se ve el patrón clásico.)

### Resumen del tema
- **Función anónima**: sin nombre, normalmente se pasa como argumento. **Lambda/arrow**: sintaxis corta `(x) => x * 2`.
- **Clausura**: una función interna que conserva acceso a las variables de la externa aunque esta ya haya terminado → estado privado.
- **Memoización/caché**: guardar resultados ya calculados (`Map`) para no repetir trabajo costoso.
- **IIFE**: encapsular código en un ámbito propio.
- Excepciones: `throw new Error(...)` y `try { } catch (e) { }` (en TS, `e` es `unknown`, de ahí `e instanceof Error`).

---

## 6. Prototipus i classes (`src/Prototipus_i_classes/`)

### 6.1 Convertir a TypeScript — `ConversioTS.ts`
| Elemento | Qué hace |
|---|---|
| `type PvpFunc` + `PVP(preu, liquidar?)` | Una **función con propiedades** (`cache`, `cacheLiquidar`): el `type` con signatura de llamada `(…) : string` + propiedades lo describe. Guarda el precio ya calculado indexado por céntimos. Liquidación = −40 % y después +21 % de IVA. |
| `crearFiltre(tipus, nom?)` | **Función que devuelve una función** (clausura). El filtro resultante lista los artículos de ese tipo (y nombre, si se indica). |
| `filtrar(filtre, out)` | Usa **`typeof s === "string"`** (*narrowing*) para tratar distinto `string` y `string[]`. |
| `type Dades` / `type Monitor` / `monitor` | Objeto tipado con `constants`, `registre` y el método `escanejar()` que lee los `<input>`; guarda **una copia** (`{ ...c }`) de las constantes en cada escaneo. |

### 6.2 Clientes y facturas — `Facturacio.ts` + `ClientsFactures.ts`
| Elemento | Qué hace |
|---|---|
| `crearGenerador(ini, max, nom)` | **Clausura contador**: cada llamada devuelve el siguiente número; al pasar de `max` lanza excepción. Clientes: 10-99; facturas: 100-999. |
| `class Client` | Valida NIF (`nifValid`) y que haya nombre y apellidos; el `id` se genera **al final** para no gastar números si falla una validación. |
| `class Factura` | Comprueba que el cliente exista, que el importe sea > 0 y que la fecha sea válida. |
| `GestioClients` (estática) | `afegir` (rechaza NIF duplicado), `buscarPerId`, `taula()`. |
| `GestioFactures` (estática) | `afegir`, `deClient`, `taulaClient(id)` (con total pendiente). |
| `App` (en `ClientsFactures.ts`) | Objeto que recibe las acciones del usuario y llama a los gestores; `intentar()` captura excepciones y las muestra. |

> **Constructor function vs class.** Una `class` es "azúcar sintáctico" sobre la función constructora y el prototipo. Equivalencia:
> ```ts
> function Client(this: any, nif: string, nom: string) { this.nif = nif; this.nom = nom; }
> Client.prototype.saluda = function () { return "Hola " + this.nom; };
> // class Client { constructor(nif, nom) {...}  saluda() {...} }  →  mismo resultado
> ```
> Los métodos de la clase viven en `Client.prototype` (se comparten entre instancias), no se copian en cada objeto. Por eso, en TypeScript, se prefiere `class`.

### 6.3 Hoteles y reservas — `Reserva.ts`, `Hotel.ts`, `Empresa.ts`, `Aplicacio.ts`
Una clase por archivo (**módulos**), propiedades privadas reales con `#`.

**`Reserva`**
| Miembro | Qué hace |
|---|---|
| `constructor(nif, places, individuals)` | Normaliza el NIF y llama a `#verificarNIF()`. |
| `#verificarNIF()` | **Método privado**: lanza excepción si el NIF no es correcto. |
| `get/set places`, `get/set individuals`, `get nif` | Getters y setters; el setter de `places` valida (entero > 0). |
| `get habitacions` | Habitaciones que ocupa: `places` si son individuales, `ceil(places / 2)` si son dobles. |
| `filaHtml()` | Fila de tabla. |

**`Hotel`**
| Miembro | Qué hace |
|---|---|
| `static #properId` | Contador **estático y privado** para el `id` automático (empieza en 0). |
| `constructor(nom, poblacio, habitacions)` | Valida nombre/población no vacíos y habitaciones > 0. |
| `reservar(nif, places, individuals)` | Crea o **modifica** la reserva de ese NIF y actualiza las habitaciones libres (`libres + antes − necesarias`). `places = 0` la anula. Si no hay sitio, **no cambia nada** y devuelve `false`. |
| `filaHtml()`, `taulaReservesHtml()` | Salida HTML. |

**`Empresa`** (todo `static`: propiedades privadas, métodos públicos)
| Miembro | Qué hace |
|---|---|
| `static #hotels` | Array privado de hoteles. |
| `static #hotel(ndx)` | **Método estático privado**: valida el índice y devuelve el hotel. |
| `getHotel(ndx)` | `"Nom_hotel (Població)"`. |
| `afegirHotel(nom, poblacio, habitacions)` | Crea y añade un hotel. |
| `reservarHotel(ndx, nif, places, individuals)` | Valida `ndx` y `places > 0`; delega en `Hotel.reservar`. |
| `anularReserva(ndx, nif)` | Extra para cancelar. |
| `mostrarHotels()` / `mostrarReservesHotel(ndx)` | Devuelven las tablas HTML. |

**`Aplicacio.ts`**: gestión de eventos (rellena el `<select>`, lee el formulario, llama a `Empresa` y muestra errores).

### 6.4 Convertir a TypeScript (2): `es2020` vs `es2022`
Compilé las clases con ambos `target` para comprobarlo:

- **ES2022**: el código generado **conserva** `#campos`, `static #x` y `#metodos` tal cual (`Hotel.js` ≈ 3,3 KB). El navegador los gestiona de forma nativa.
- **ES2020**: no existen los `#` nativos, así que TypeScript los **reescribe** con `WeakMap`/`WeakSet` (`_Hotel_id.set(this, …)`) y añade funciones ayudantes `__classPrivateFieldGet` / `__classPrivateFieldSet` (`Hotel.js` ≈ 6 KB). Funciona igual, pero el código es más largo y algo más lento.
- Para probarlo: cambia `"target"` en `tsconfig.json` (y `"module"` si quieres) y ejecuta `npx tsc`.

### Resumen del tema
- **Prototipos**: cada objeto tiene un prototipo del que hereda métodos; las clases lo organizan con mejor sintaxis.
- **`class`**: `constructor`, métodos, `get`/`set`, `static`, y privacidad real con `#`. (La palabra `private` de TypeScript solo se comprueba al compilar; `#` es privado también en ejecución.)
- **Módulos ES**: `export class …` / `import { … } from "./Archivo.js"` (en el import se escribe `.js`, que es lo que existirá en `dist/`).
- Patrón **gestor estático** (`Empresa`, `GestioClients`): no hace falta instanciar nada.
- Validar en el constructor y lanzar **excepciones** garantiza que nunca existan objetos inválidos.

---

## 7. Chuleta de conceptos TypeScript usados

| Concepto | Ejemplo | Para qué |
|---|---|---|
| Anotación de tipos | `let n: number` | Detectar errores al compilar |
| `interface` / `type` | `interface Client { nif: string }` | Describir la forma de un objeto |
| Opcional | `pes?: number` | Propiedad o parámetro que puede faltar |
| Unión | `string \| undefined`, `1 \| 2` | Varios tipos posibles |
| Genéricos | `<T extends object>(a: T[])` | Funciones que conservan el tipo |
| Sobrecarga | varias firmas de `preuFinal` | Tipo de retorno según los argumentos |
| Rest/defecto | `...vals`, `n = 100` | Número variable / valor por defecto |
| `as` | `valor as number` | Indicar un tipo que el compilador no puede deducir |
| *Narrowing* | `typeof x === "string"`, `e instanceof Error` | Acotar un tipo dentro de un `if` |
| `unknown` | `catch (e)` | Obliga a comprobar antes de usar |
| `readonly` | `readonly id: number` | Solo se asigna una vez |
| Clases | `#privado`, `static`, `get/set` | Programación orientada a objetos |
| Módulos | `import` / `export` | Separar el código en archivos |
| `declare` | `declare const AES: {...}` | Describir algo que existe fuera de TS |

## 8. Resumen final

1. **Arrays** (Llistes): `map/filter/reduce/some/every/sort`, búsqueda lineal vs binaria, ordenar antes de buscar.
2. **Objetos** (Objectes): tipar con `interface`, funciones genéricas de búsqueda, copia profunda con `structuredClone`, objetos con estado y métodos (domótica).
3. **Funciones** (Funcions): parámetros por defecto/rest, sobrecarga, funciones como valores, `BigInt`, claves canónicas (anagramas).
4. **Funciones avanzadas** (Més funcions): anónimas, lambdas, **clausuras**, caché, IIFE, excepciones, llamar por nombre con un registro.
5. **Clases** (Prototipus i classes): `class`, `#privado`, `static`, `get/set`, módulos ES, gestores estáticos y diferencia entre compilar a ES2020 y ES2022.
