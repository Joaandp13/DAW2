const NOM_FINESTRA = "finestraExercici3";
const estat = document.getElementById("estat");
const registre = document.getElementById("log");
const ampladaInput = document.getElementById("amplada");
const alcadaInput = document.getElementById("alcada");
const esquerraInput = document.getElementById("esquerra");
const daltInput = document.getElementById("dalt");
let finestra = null;
function afegirLog(text) {
    const hora = new Date().toLocaleTimeString("ca-ES");
    const li = document.createElement("li");
    li.textContent = `[${hora}] ${text}`;
    registre.prepend(li);
}
function estaOberta() {
    return finestra !== null && !finestra.closed;
}
function llegirNumero(input, defecte) {
    if (input.value.trim() === "") {
        return defecte;
    }
    const valor = Number(input.value);
    return Number.isFinite(valor) ? Math.round(valor) : defecte;
}
function actualitzarEstat() {
    if (finestra === null) {
        estat.textContent = "No s'ha obert cap finestra en aquesta sessió.";
        return;
    }
    if (finestra.closed) {
        estat.textContent = "La finestra s'ha tancat (finestra.closed === true).";
        return;
    }
    let geometria = "";
    try {
        geometria = ` Posició (${finestra.screenX}, ${finestra.screenY}); mida ${finestra.outerWidth} × ${finestra.outerHeight} px.`;
    }
    catch {
        geometria = " No es pot llegir la geometria per restriccions d'origen.";
    }
    estat.textContent = `Oberta i accessible (finestra.closed === false).${geometria}`;
}
function obrir() {
    if (estaOberta()) {
        finestra?.focus();
        afegirLog("Ja hi havia una finestra amb aquest nom; window.open l'ha reutilitzada.");
        actualitzarEstat();
        return;
    }
    const amplada = Math.max(200, llegirNumero(ampladaInput, Math.floor(screen.availWidth / 2)));
    const alcada = Math.max(150, llegirNumero(alcadaInput, Math.floor(screen.availHeight / 2)));
    const esquerra = llegirNumero(esquerraInput, Math.floor((screen.availWidth - amplada) / 2));
    const dalt = llegirNumero(daltInput, Math.floor((screen.availHeight - alcada) / 2));
    const caracteristiques = [
        "popup=yes",
        `width=${amplada}`,
        `height=${alcada}`,
        `left=${esquerra}`,
        `top=${dalt}`,
        "resizable=yes",
        "scrollbars=yes",
    ].join(",");
    finestra = window.open("fill.html", NOM_FINESTRA, caracteristiques);
    if (finestra === null) {
        afegirLog("window.open() ha retornat null: el navegador ha bloquejat la finestra.");
        window.alert("El navegador ha bloquejat la finestra emergent. Permet els popups per a aquesta pàgina i torna-ho a provar.");
        actualitzarEstat();
        return;
    }
    afegirLog(`window.open("fill.html", "${NOM_FINESTRA}", "${caracteristiques}") → finestra oberta.`);
    finestra.focus();
    actualitzarEstat();
}
function ambFinestra(accio, descripcio) {
    if (finestra === null || !estaOberta()) {
        afegirLog("No hi ha cap finestra oberta sobre la qual actuar.");
        return;
    }
    try {
        accio(finestra);
        afegirLog(`${descripcio} executat.`);
    }
    catch (error) {
        const missatge = error instanceof Error ? error.message : String(error);
        afegirLog(`No s'ha pogut executar ${descripcio}: ${missatge}`);
    }
    actualitzarEstat();
}
function enfocar() {
    ambFinestra((f) => f.focus(), "finestra.focus()");
}
function centrar() {
    ambFinestra((f) => {
        let amplada = f.outerWidth;
        let alcada = f.outerHeight;
        if (!amplada || !alcada) {
            amplada = 480;
            alcada = 360;
        }
        const x = Math.max(0, Math.round((screen.availWidth - amplada) / 2));
        const y = Math.max(0, Math.round((screen.availHeight - alcada) / 2));
        f.moveTo(x, y);
    }, "finestra.moveTo() per centrar-la");
}
function moure() {
    const x = llegirNumero(esquerraInput, 0);
    const y = llegirNumero(daltInput, 0);
    ambFinestra((f) => f.moveTo(x, y), `finestra.moveTo(${x}, ${y})`);
}
function redimensionar() {
    const amplada = Math.max(200, llegirNumero(ampladaInput, 800));
    const alcada = Math.max(150, llegirNumero(alcadaInput, 600));
    ambFinestra((f) => f.resizeTo(amplada, alcada), `finestra.resizeTo(${amplada}, ${alcada})`);
}
function tancar() {
    if (finestra === null) {
        afegirLog("No hi ha cap referència a cap finestra.");
        return;
    }
    if (finestra.closed) {
        afegirLog("La finestra ja estava tancada.");
        actualitzarEstat();
        return;
    }
    finestra.close();
    afegirLog("S'ha cridat finestra.close() des de la finestra pare.");
    actualitzarEstat();
}
const ampladaInicial = Math.floor(screen.availWidth / 2);
const alcadaInicial = Math.floor(screen.availHeight / 2);
ampladaInput.value = String(ampladaInicial);
alcadaInput.value = String(alcadaInicial);
esquerraInput.value = String(ampladaInicial);
daltInput.value = "0";
document.getElementById("btnObrir")?.addEventListener("click", obrir);
document.getElementById("btnEnfocar")?.addEventListener("click", enfocar);
document.getElementById("btnCentrar")?.addEventListener("click", centrar);
document.getElementById("btnMoure")?.addEventListener("click", moure);
document.getElementById("btnRedimensionar")?.addEventListener("click", redimensionar);
document.getElementById("btnTancar")?.addEventListener("click", tancar);
document.getElementById("btnEstat")?.addEventListener("click", () => {
    afegirLog("Comprovació manual de l'estat de la finestra.");
    actualitzarEstat();
});
window.setInterval(actualitzarEstat, 1000);
actualitzarEstat();
afegirLog("Exercici 3 carregat. Prem «Obrir finestra» per començar.");
export {};
//# sourceMappingURL=app.js.map