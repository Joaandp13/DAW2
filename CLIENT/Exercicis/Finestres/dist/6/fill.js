import { esMissatge } from "./tipus.js";
const info = document.getElementById("info");
const registre = document.getElementById("log");
const respostaInput = document.getElementById("resposta");
function afegirLog(text) {
    const hora = new Date().toLocaleTimeString("ca-ES");
    const li = document.createElement("li");
    li.textContent = `[${hora}] ${text}`;
    registre.prepend(li);
}
function obtenirPare() {
    return window.opener;
}
function descriure(missatge) {
    switch (missatge.tipus) {
        case "text":
            return `text "${missatge.text}"`;
        case "mides":
            return `mides ${missatge.amplada} × ${missatge.alcada} (exterior ${missatge.exterior})`;
    }
}
function enviarAlPare(missatge) {
    const pare = obtenirPare();
    if (pare === null) {
        afegirLog("No hi ha window.opener: no es pot enviar el missatge.");
        return;
    }
    pare.postMessage(missatge, "*");
    afegirLog(`Fill → pare: ${descriure(missatge)}`);
}
function enviarMides() {
    enviarAlPare({
        tipus: "mides",
        amplada: window.innerWidth,
        alcada: window.innerHeight,
        exterior: `${window.outerWidth} × ${window.outerHeight}`,
    });
}
function actualitzarInfo() {
    const pare = obtenirPare();
    info.textContent = [
        `window.name: ${window.name || "(buit)"}`,
        `window.opener: ${pare === null ? "null" : "definit"}`,
        `opener === window.parent: ${pare === window.parent}`,
        `innerWidth × innerHeight: ${window.innerWidth} × ${window.innerHeight}`,
        `outerWidth × outerHeight: ${window.outerWidth} × ${window.outerHeight}`,
        `location.origin: ${window.location.origin}`,
    ].join("\n");
}
window.addEventListener("message", (event) => {
    const pare = obtenirPare();
    const origen = event.source;
    if (pare === null || origen !== pare) {
        afegirLog(`Missatge ignorat: no prové del pare (origin: ${event.origin}).`);
        return;
    }
    if (!esMissatge(event.data)) {
        afegirLog("Missatge ignorat: el format no és vàlid.");
        return;
    }
    switch (event.data.tipus) {
        case "text":
            afegirLog(`Pare → fill: "${event.data.text}" · origin=${event.origin}`);
            break;
        case "peticio-mides":
            afegirLog("El pare ha demanat les mides de la finestra.");
            enviarMides();
            break;
        case "tancar":
            afegirLog("El pare ha ordenat tancar aquesta finestra.");
            window.close();
            break;
        case "mides":
            afegirLog("Missatge de mides rebut (el fill no l'havia de rebre).");
            break;
    }
});
document.getElementById("btnRespondre")?.addEventListener("click", () => {
    const text = respostaInput.value.trim();
    if (text === "") {
        afegirLog("Escriu una resposta abans d'enviar-la.");
        return;
    }
    enviarAlPare({ tipus: "text", text });
    respostaInput.value = "";
    respostaInput.focus();
});
respostaInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        document.getElementById("btnRespondre")?.click();
    }
});
document.getElementById("btnMides")?.addEventListener("click", enviarMides);
document.getElementById("btnTancar")?.addEventListener("click", () => {
    afegirLog("S'ha cridat window.close() des del fill.");
    window.close();
});
document.getElementById("btnNetejar")?.addEventListener("click", () => {
    registre.replaceChildren();
    afegirLog("Registre netejat.");
});
window.addEventListener("resize", actualitzarInfo);
window.addEventListener("load", () => {
    actualitzarInfo();
    afegirLog("Finestra filla carregada. S'envien les mides al pare.");
    enviarMides();
}, { once: true });
actualitzarInfo();
//# sourceMappingURL=fill.js.map