// Exercici 4: geometria de la finestra, desplaçament, pantalla completa i media queries.

const metrics = document.getElementById("metrics") as HTMLPreElement;
const mitjans = document.getElementById("mitjans") as HTMLPreElement;
const registre = document.getElementById("log") as HTMLOListElement;

function afegirLog(text: string): void {
  const hora = new Date().toLocaleTimeString("ca-ES");
  const li = document.createElement("li");
  li.textContent = `[${hora}] ${text}`;
  registre.prepend(li);
}

function llegirMetrics(): string {
  const vv = window.visualViewport;

  return [
    `innerWidth × innerHeight: ${window.innerWidth} × ${window.innerHeight}`,
    `outerWidth × outerHeight: ${window.outerWidth} × ${window.outerHeight}`,
    `screenX / screenY (finestra): ${window.screenX} / ${window.screenY}`,
    `screen.width × screen.height: ${screen.width} × ${screen.height}`,
    `screen.availWidth × availHeight: ${screen.availWidth} × ${screen.availHeight}`,
    `devicePixelRatio: ${window.devicePixelRatio}`,
    `scrollX / scrollY: ${Math.round(window.scrollX)} / ${Math.round(window.scrollY)}`,
    `documentElement.clientWidth × clientHeight: ${document.documentElement.clientWidth} × ${document.documentElement.clientHeight}`,
    `visualViewport: ${vv === null ? "no disponible" : `${Math.round(vv.width)} × ${Math.round(vv.height)} (escala ${vv.scale.toFixed(2)})`}`,
    `screen.orientation: ${screen.orientation?.type ?? "no disponible"}`,
  ].join("\n");
}

interface ProvaMitja {
  consulta: string;
  descripcio: string;
}

const PROVES: ProvaMitja[] = [
  { consulta: "(prefers-color-scheme: dark)", descripcio: "Tema fosc" },
  { consulta: "(pointer: coarse)", descripcio: "Punter tàctil" },
  { consulta: "(max-width: 600px)", descripcio: "Finestra estreta (≤ 600px)" },
  { consulta: "(display-mode: standalone)", descripcio: "Mode aplicació" },
  { consulta: "(prefers-reduced-motion: reduce)", descripcio: "Moviment reduït" },
];

function llegirMitjans(): string {
  return PROVES.map(
    (prova) => `${prova.descripcio}: ${window.matchMedia(prova.consulta).matches ? "sí" : "no"}`
  ).join("\n");
}

// Evita actualitzar el DOM moltes vegades seguides durant un resize o scroll.
let actualitzacioPendent = false;

function programarActualitzacio(): void {
  if (actualitzacioPendent) {
    return;
  }

  actualitzacioPendent = true;
  window.requestAnimationFrame(() => {
    actualitzacioPendent = false;
    metrics.textContent = llegirMetrics();
    mitjans.textContent = llegirMitjans();
  });
}

function ambFinestra(accio: () => void, descripcio: string): void {
  try {
    accio();
    afegirLog(`${descripcio} executat.`);
  } catch (error) {
    const missatge = error instanceof Error ? error.message : String(error);
    afegirLog(`No s'ha pogut executar ${descripcio}: ${missatge}`);
  }
  programarActualitzacio();
}

function alternarPantallaCompleta(): void {
  if (document.fullscreenElement !== null) {
    document
      .exitFullscreen()
      .then(() => afegirLog("S'ha sortit de pantalla completa."))
      .catch((error: unknown) => {
        const missatge = error instanceof Error ? error.message : String(error);
        afegirLog(`No s'ha pogut sortir de pantalla completa: ${missatge}`);
      });
    return;
  }

  document.documentElement
    .requestFullscreen()
    .then(() => afegirLog("S'ha entrat en pantalla completa."))
    .catch((error: unknown) => {
      const missatge = error instanceof Error ? error.message : String(error);
      afegirLog(`No s'ha pogut entrar en pantalla completa: ${missatge}`);
    });
}

document.addEventListener("fullscreenchange", () => {
  afegirLog(
    document.fullscreenElement === null
      ? "Esdeveniment fullscreenchange: ja no hi ha pantalla completa."
      : "Esdeveniment fullscreenchange: pantalla completa activa."
  );
  programarActualitzacio();
});

window.addEventListener("resize", () => {
  afegirLog("Esdeveniment resize.");
  programarActualitzacio();
});

window.addEventListener("scroll", programarActualitzacio, { passive: true });

document.getElementById("btnAvall")?.addEventListener("click", () => {
  window.scrollBy({ top: 300, behavior: "smooth" });
  afegirLog("window.scrollBy({ top: 300 }).");
});

document.getElementById("btnDalt")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  afegirLog("window.scrollTo({ top: 0 }).");
});

document.getElementById("btnMoure")?.addEventListener("click", () => {
  ambFinestra(() => window.moveTo(0, 0), "window.moveTo(0, 0)");
});

document.getElementById("btnRedimensionar")?.addEventListener("click", () => {
  ambFinestra(() => window.resizeTo(900, 650), "window.resizeTo(900, 650)");
});

document.getElementById("btnCompleta")?.addEventListener("click", alternarPantallaCompleta);

document.getElementById("btnActualitzar")?.addEventListener("click", () => {
  afegirLog("Actualització manual de les mètriques.");
  programarActualitzacio();
});

window.addEventListener("load", () => {
  afegirLog("Esdeveniment load de la finestra.");
  programarActualitzacio();
});

metrics.textContent = llegirMetrics();
mitjans.textContent = llegirMitjans();
afegirLog("Exercici 4 carregat. Redimensiona o desplaça la pàgina per veure els canvis.");
