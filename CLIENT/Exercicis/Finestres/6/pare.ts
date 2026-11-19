// Exercici 6: comunicació bidireccional entre finestres amb window.postMessage().

import { esMissatge } from "./tipus.js";
import type { Missatge } from "./tipus.js";

const NOM_FILL = "fillExercici6";

const estatFill = document.getElementById("estatFill") as HTMLParagraphElement;
const registre = document.getElementById("log") as HTMLOListElement;
const missatgeInput = document.getElementById("missatge") as HTMLInputElement;

let fill: Window | null = null;

function afegirLog(text: string): void {
  const hora = new Date().toLocaleTimeString("ca-ES");
  const li = document.createElement("li");
  li.textContent = `[${hora}] ${text}`;
  registre.prepend(li);
}

function descriure(missatge: Missatge): string {
  switch (missatge.tipus) {
    case "text":
      return `text "${missatge.text}"`;
    case "peticio-mides":
      return "petició de mides";
    case "tancar":
      return "ordre de tancar";
    case "mides":
      return `mides ${missatge.amplada} × ${missatge.alcada} (exterior ${missatge.exterior})`;
  }
}

function fillObert(): boolean {
  return fill !== null && !fill.closed;
}

function actualitzarEstat(): void {
  if (fill === null) {
    estatFill.textContent = "Encara no s'ha obert cap finestra filla.";
    return;
  }

  estatFill.textContent = fill.closed
    ? "La finestra filla està tancada."
    : "La finestra filla està oberta i es pot comunicar amb postMessage().";
}

function obrirFill(): void {
  if (fillObert()) {
    fill?.focus();
    afegirLog("La finestra filla ja era oberta; s'ha enfocat.");
    actualitzarEstat();
    return;
  }

  const amplada = Math.floor(screen.availWidth / 2);
  const alcada = Math.floor(screen.availHeight / 2);
  const esquerra = Math.floor(screen.availWidth / 2);
  const caracteristiques = `popup=yes,width=${amplada},height=${alcada},left=${esquerra},top=0,resizable=yes,scrollbars=yes`;

  fill = window.open("fill.html", NOM_FILL, caracteristiques);

  if (fill === null) {
    afegirLog("window.open() ha retornat null: el navegador ha bloquejat la finestra filla.");
    window.alert("Permet els popups per poder fer l'exercici de postMessage().");
    actualitzarEstat();
    return;
  }

  afegirLog(`Finestra filla oberta amb el nom "${NOM_FILL}".`);
  fill.focus();
  actualitzarEstat();
}

function enviar(missatge: Missatge): void {
  if (!fillObert() || fill === null) {
    afegirLog("No es pot enviar el missatge: la finestra filla no està oberta.");
    return;
  }

  // targetOrigin "*" permet qualsevol origen. En una aplicació real s'hauria
  // d'indicar l'origen concret del fill (per exemple "https://exemple.com").
  fill.postMessage(missatge, "*");
  afegirLog(`Pare → fill: ${descriure(missatge)}`);
}

function tancarFill(): void {
  if (!fillObert() || fill === null) {
    afegirLog("No hi ha cap finestra filla oberta per tancar.");
    actualitzarEstat();
    return;
  }

  fill.close();
  afegirLog("S'ha cridat fill.close() des del pare.");
  actualitzarEstat();
}

window.addEventListener("message", (event: MessageEvent<unknown>) => {
  const origen = event.source as Window | null;

  // Només acceptem missatges que vinguin de la finestra que hem obert.
  if (origen === null || origen !== fill) {
    afegirLog(`Missatge ignorat: la font no és la finestra filla (origin: ${event.origin}).`);
    return;
  }

  // Amb fitxers oberts amb file:// l'origen és la cadena "null".
  // En producció, compara sempre event.origin amb una llista blanca.
  const origensPermesos = [window.location.origin, "null"];
  if (!origensPermesos.includes(event.origin)) {
    afegirLog(`Missatge rebutjat: origen no permès (${event.origin}).`);
    return;
  }

  if (!esMissatge(event.data)) {
    afegirLog("Missatge ignorat: el format no és vàlid.");
    return;
  }

  afegirLog(`Fill → pare: ${descriure(event.data)} · origin=${event.origin}`);

  if (event.data.tipus === "mides") {
    estatFill.textContent = `Mides rebudes del fill: ${event.data.amplada} × ${event.data.alcada} px (exterior ${event.data.exterior}).`;
  }
});

document.getElementById("btnObrir")?.addEventListener("click", obrirFill);
document.getElementById("btnTancar")?.addEventListener("click", tancarFill);

document.getElementById("btnEnviar")?.addEventListener("click", () => {
  const text = missatgeInput.value.trim();

  if (text === "") {
    afegirLog("Escriu un text abans d'enviar-lo.");
    return;
  }

  enviar({ tipus: "text", text });
  missatgeInput.value = "";
  missatgeInput.focus();
});

missatgeInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    document.getElementById("btnEnviar")?.click();
  }
});

document.getElementById("btnMides")?.addEventListener("click", () => {
  enviar({ tipus: "peticio-mides" });
});

document.getElementById("btnTancarFill")?.addEventListener("click", () => {
  enviar({ tipus: "tancar" });
});

document.getElementById("btnNetejar")?.addEventListener("click", () => {
  registre.replaceChildren();
  afegirLog("Registre netejat.");
});

window.setInterval(actualitzarEstat, 1000);

actualitzarEstat();
afegirLog("Exercici 6 carregat. Obre la finestra filla i intercanvia missatges.");
