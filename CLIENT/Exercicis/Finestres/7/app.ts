// Exercici 7: diàlegs natius, setTimeout, setInterval i requestAnimationFrame.

const sortidaDialegs = document.getElementById("sortidaDialegs") as HTMLPreElement;
const estatDiferit = document.getElementById("estatDiferit") as HTMLParagraphElement;
const rellotge = document.getElementById("rellotge") as HTMLParagraphElement;
const barraProgres = document.getElementById("progres") as HTMLDivElement;
const registre = document.getElementById("log") as HTMLOListElement;

function afegirLog(text: string): void {
  const hora = new Date().toLocaleTimeString("ca-ES");
  const li = document.createElement("li");
  li.textContent = `[${hora}] ${text}`;
  registre.prepend(li);
}

// ------------------------- Diàlegs natius -------------------------

document.getElementById("btnAlert")?.addEventListener("click", () => {
  window.alert("Això és un diàleg natiu creat amb window.alert().");
  sortidaDialegs.textContent = "alert() s'ha mostrat. No retorna cap valor.";
  afegirLog("window.alert() mostrat.");
});

document.getElementById("btnConfirm")?.addEventListener("click", () => {
  const resposta = window.confirm("Vols continuar amb l'exercici?");
  sortidaDialegs.textContent = `confirm() ha retornat: ${resposta}`;
  afegirLog(`window.confirm() → ${resposta}`);
});

document.getElementById("btnPrompt")?.addEventListener("click", () => {
  const nom = window.prompt("Com et dius?", "Joan");

  sortidaDialegs.textContent =
    nom === null ? "prompt() ha retornat null (s'ha cancel·lat)." : `prompt() ha retornat: "${nom}"`;
  afegirLog(nom === null ? "window.prompt() cancel·lat." : `window.prompt() → "${nom}"`);
});

document.getElementById("btnImprimir")?.addEventListener("click", () => {
  afegirLog("S'ha cridat window.print().");
  window.print();
});

// ------------------------- setTimeout -------------------------

const SEGONS_DIFERIT = 3;
let timeoutId: number | null = null;
let compteEnrereId: number | null = null;

function cancelarIdsDiferit(): void {
  if (timeoutId !== null) {
    window.clearTimeout(timeoutId);
    timeoutId = null;
  }

  if (compteEnrereId !== null) {
    window.clearInterval(compteEnrereId);
    compteEnrereId = null;
  }
}

function programarDiferit(): void {
  cancelarIdsDiferit();

  let restant = SEGONS_DIFERIT;
  estatDiferit.textContent = `Missatge programat d'aquí a ${restant} s…`;
  afegirLog(`setTimeout programat per dins de ${SEGONS_DIFERIT} s.`);

  compteEnrereId = window.setInterval(() => {
    restant -= 1;

    if (restant > 0) {
      estatDiferit.textContent = `Missatge programat d'aquí a ${restant} s…`;
    }
  }, 1000);

  timeoutId = window.setTimeout(() => {
    if (compteEnrereId !== null) {
      window.clearInterval(compteEnrereId);
      compteEnrereId = null;
    }

    timeoutId = null;
    estatDiferit.textContent = "Missatge alliberat! El setTimeout s'ha executat.";
    afegirLog("setTimeout executat després del temps indicat.");
  }, SEGONS_DIFERIT * 1000);
}

function aturarDiferit(): void {
  cancelarIdsDiferit();
  estatDiferit.textContent = "Temporitzador cancel·lat amb clearTimeout() i clearInterval().";
  afegirLog("Temporitzador diferit cancel·lat.");
}

// ------------------------- setInterval -------------------------

let cronometreId: number | null = null;
let segons = 0;

function formatTemps(total: number): string {
  const minuts = Math.floor(total / 60);
  const segonsRestants = total % 60;
  return `${String(minuts).padStart(2, "0")}:${String(segonsRestants).padStart(2, "0")}`;
}

function iniciarCronometre(): void {
  if (cronometreId !== null) {
    afegirLog("El cronòmetre ja estava en marxa.");
    return;
  }

  cronometreId = window.setInterval(() => {
    segons += 1;
    rellotge.textContent = formatTemps(segons);
  }, 1000);

  afegirLog("setInterval iniciat (1 segon).");
}

function aturarCronometre(): void {
  if (cronometreId === null) {
    afegirLog("El cronòmetre ja estava aturat.");
    return;
  }

  window.clearInterval(cronometreId);
  cronometreId = null;
  afegirLog(`Cronòmetre aturat a ${formatTemps(segons)}.`);
}

function reiniciarCronometre(): void {
  aturarCronometre();
  segons = 0;
  rellotge.textContent = formatTemps(0);
  afegirLog("Cronòmetre reiniciat.");
}

// ------------------------- requestAnimationFrame -------------------------

const DURADA_ANIMACIO = 2000;
let animacioId: number | null = null;
let instantInici = 0;

function pasAnimacio(instant: number): void {
  if (instantInici === 0) {
    instantInici = instant;
  }

  const fraccio = Math.min((instant - instantInici) / DURADA_ANIMACIO, 1);
  barraProgres.style.width = `${(fraccio * 100).toFixed(1)}%`;

  if (fraccio < 1) {
    animacioId = window.requestAnimationFrame(pasAnimacio);
  } else {
    animacioId = null;
    afegirLog("Animació amb requestAnimationFrame completada.");
  }
}

function iniciarAnimacio(): void {
  if (animacioId !== null) {
    afegirLog("L'animació ja estava en marxa.");
    return;
  }

  instantInici = 0;
  barraProgres.style.width = "0%";
  animacioId = window.requestAnimationFrame(pasAnimacio);
  afegirLog("Animació iniciada amb requestAnimationFrame().");
}

function aturarAnimacio(): void {
  if (animacioId === null) {
    afegirLog("No hi ha cap animació en marxa.");
    return;
  }

  window.cancelAnimationFrame(animacioId);
  animacioId = null;
  afegirLog("Animació aturada amb cancelAnimationFrame().");
}

document.getElementById("btnDiferit")?.addEventListener("click", programarDiferit);
document.getElementById("btnCancelarDiferit")?.addEventListener("click", aturarDiferit);
document.getElementById("btnIniciar")?.addEventListener("click", iniciarCronometre);
document.getElementById("btnAturar")?.addEventListener("click", aturarCronometre);
document.getElementById("btnReiniciar")?.addEventListener("click", reiniciarCronometre);
document.getElementById("btnAnimacio")?.addEventListener("click", iniciarAnimacio);
document.getElementById("btnAturarAnimacio")?.addEventListener("click", aturarAnimacio);

rellotge.textContent = formatTemps(0);
estatDiferit.textContent = "Cap missatge programat.";
afegirLog("Exercici 7 carregat. Prova els diàlegs i els temporitzadors.");
