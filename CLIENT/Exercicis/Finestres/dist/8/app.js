const registre = document.getElementById("log");
const localInfo = document.getElementById("localInfo");
const sessionInfo = document.getElementById("sessionInfo");
const clauInput = document.getElementById("clau");
const valorInput = document.getElementById("valor");
const avisTancar = document.getElementById("avisTancar");
const connectivitat = document.getElementById("connectivitat");
const visibilitat = document.getElementById("visibilitat");
const infoFinestra = document.getElementById("infoFinestra");
const canalText = document.getElementById("canalText");
function afegirLog(text) {
    const hora = new Date().toLocaleTimeString("ca-ES");
    const li = document.createElement("li");
    li.textContent = `[${hora}] ${text}`;
    registre.prepend(li);
}
function llistar(emmagatzematge) {
    if (emmagatzematge.length === 0) {
        return "(buit)";
    }
    const linies = [];
    for (let i = 0; i < emmagatzematge.length; i += 1) {
        const clau = emmagatzematge.key(i);
        if (clau === null) {
            continue;
        }
        linies.push(`${clau} = ${emmagatzematge.getItem(clau) ?? ""}`);
    }
    return linies.sort((a, b) => a.localeCompare(b, "ca")).join("\n");
}
function refrescarEmmagatzematge() {
    localInfo.textContent = llistar(window.localStorage);
    sessionInfo.textContent = llistar(window.sessionStorage);
}
function obtenirClau() {
    const clau = clauInput.value.trim();
    if (clau === "") {
        afegirLog("Cal escriure una clau d'emmagatzematge.");
        return null;
    }
    return clau;
}
function desar(emmagatzematge, nom) {
    const clau = obtenirClau();
    if (clau === null) {
        return;
    }
    emmagatzematge.setItem(clau, valorInput.value);
    afegirLog(`${nom}.setItem("${clau}", "${valorInput.value}")`);
    refrescarEmmagatzematge();
}
function llegir(emmagatzematge, nom) {
    const clau = obtenirClau();
    if (clau === null) {
        return;
    }
    const valor = emmagatzematge.getItem(clau);
    afegirLog(`${nom}.getItem("${clau}") → ${valor === null ? "null" : `"${valor}"`}`);
}
function esborrar(emmagatzematge, nom) {
    const clau = obtenirClau();
    if (clau === null) {
        return;
    }
    emmagatzematge.removeItem(clau);
    afegirLog(`${nom}.removeItem("${clau}")`);
    refrescarEmmagatzematge();
}
function buidar(emmagatzematge, nom) {
    if (!window.confirm(`Segur que vols buidar ${nom}?`)) {
        return;
    }
    emmagatzematge.clear();
    afegirLog(`${nom}.clear()`);
    refrescarEmmagatzematge();
}
document.getElementById("btnLocalSet")?.addEventListener("click", () => desar(localStorage, "localStorage"));
document.getElementById("btnLocalGet")?.addEventListener("click", () => llegir(localStorage, "localStorage"));
document.getElementById("btnLocalRemove")?.addEventListener("click", () => esborrar(localStorage, "localStorage"));
document.getElementById("btnLocalClear")?.addEventListener("click", () => buidar(localStorage, "localStorage"));
document.getElementById("btnSessionSet")?.addEventListener("click", () => desar(sessionStorage, "sessionStorage"));
document.getElementById("btnSessionGet")?.addEventListener("click", () => llegir(sessionStorage, "sessionStorage"));
document.getElementById("btnSessionRemove")?.addEventListener("click", () => esborrar(sessionStorage, "sessionStorage"));
document.getElementById("btnSessionClear")?.addEventListener("click", () => buidar(sessionStorage, "sessionStorage"));
window.addEventListener("storage", (event) => {
    afegirLog(`storage · clau=${event.key ?? "(clear)"} · valor=${event.newValue ?? "null"} · url=${event.url}`);
    refrescarEmmagatzematge();
});
function mostraEntorn() {
    connectivitat.textContent = navigator.onLine ? "en línia" : "fora de línia";
    visibilitat.textContent = document.visibilityState;
    infoFinestra.textContent = [
        `window.name: ${window.name || "(buit)"}`,
        `self === window: ${window.self === window}`,
        `top === window: ${window.top === window}`,
        `parent === window: ${window.parent === window}`,
        `opener: ${window.opener === null ? "null" : "definit"}`,
        `navigator.language: ${navigator.language}`,
        `location.origin: ${window.location.origin}`,
    ].join("\n");
}
window.addEventListener("online", () => {
    afegirLog("Esdeveniment online: el navegador ha recuperat la connexió.");
    mostraEntorn();
});
window.addEventListener("offline", () => {
    afegirLog("Esdeveniment offline: el navegador ha perdut la connexió.");
    mostraEntorn();
});
document.addEventListener("visibilitychange", () => {
    afegirLog(`Esdeveniment visibilitychange · document.visibilityState=${document.visibilityState}`);
    mostraEntorn();
});
window.addEventListener("pageshow", (event) => {
    afegirLog(`Esdeveniment pageshow · persisted=${event.persisted}`);
});
window.addEventListener("pagehide", (event) => {
    afegirLog(`Esdeveniment pagehide · persisted=${event.persisted}`);
});
let avisarEnTancar = false;
avisTancar.addEventListener("change", () => {
    avisarEnTancar = avisTancar.checked;
    afegirLog(`Avís abans de tancar: ${avisarEnTancar ? "activat" : "desactivat"}.`);
});
window.addEventListener("beforeunload", (event) => {
    if (!avisarEnTancar) {
        return;
    }
    event.preventDefault();
    event.returnValue = "Hi ha canvis sense desar.";
});
const canal = new BroadcastChannel("finestres8");
canal.addEventListener("message", (event) => {
    const dada = event.data;
    afegirLog(`BroadcastChannel → ${typeof dada === "string" ? dada : JSON.stringify(dada)}`);
});
document.getElementById("btnCanal")?.addEventListener("click", () => {
    const text = canalText.value.trim();
    if (text === "") {
        afegirLog("Escriu un missatge per enviar pel canal.");
        return;
    }
    canal.postMessage(text);
    afegirLog(`BroadcastChannel enviat: "${text}" (el mateix emissor no el rep).`);
    canalText.value = "";
});
document.getElementById("btnNovaPestanya")?.addEventListener("click", () => {
    const nova = window.open(window.location.href, "_blank");
    if (nova === null) {
        afegirLog("El navegador ha bloquejat la pestanya nova.");
        return;
    }
    afegirLog("Pestanya nova oberta. Canvia-hi l'emmagatzematge i torna a aquesta.");
});
clauInput.value = "nom";
valorInput.value = "Joan";
refrescarEmmagatzematge();
mostraEntorn();
afegirLog("Exercici 8 carregat. Obre una altra pestanya i prova storage i BroadcastChannel.");
export {};
//# sourceMappingURL=app.js.map