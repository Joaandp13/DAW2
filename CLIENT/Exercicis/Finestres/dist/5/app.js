const locationInfo = document.getElementById("locationInfo");
const historyInfo = document.getElementById("historyInfo");
const vistaActual = document.getElementById("vistaActual");
const registre = document.getElementById("log");
const queryClau = document.getElementById("queryClau");
const queryValor = document.getElementById("queryValor");
const hashInput = document.getElementById("hashInput");
function afegirLog(text) {
    const hora = new Date().toLocaleTimeString("ca-ES");
    const li = document.createElement("li");
    li.textContent = `[${hora}] ${text}`;
    registre.prepend(li);
}
function mostrarLocation() {
    const loc = window.location;
    const parametres = [];
    new URLSearchParams(loc.search).forEach((valor, clau) => {
        parametres.push(`  ${clau} = ${valor}`);
    });
    locationInfo.textContent = [
        `hash: ${loc.hash || "(buit)"}`,
        `host: ${loc.host || "(buit)"}`,
        `hostname: ${loc.hostname || "(buit)"}`,
        `href: ${loc.href}`,
        `origin: ${loc.origin}`,
        `pathname: ${loc.pathname}`,
        `port: ${loc.port || "(predeterminat)"}`,
        `protocol: ${loc.protocol}`,
        `search: ${loc.search || "(buit)"}`,
        "searchParams:",
        ...(parametres.length > 0 ? parametres : ["  (cap)"]),
    ].join("\n");
}
function mostrarHistory() {
    historyInfo.textContent = [
        `history.length: ${window.history.length}`,
        `history.state: ${JSON.stringify(window.history.state)}`,
        `document.referrer: ${document.referrer || "(buit)"}`,
    ].join("\n");
}
function mostrarVista() {
    const params = new URLSearchParams(window.location.search);
    const vista = params.get("vista") ?? "(sense vista)";
    const idioma = params.get("lang") ?? "(sense idioma)";
    vistaActual.textContent = `Vista: ${vista} · Idioma: ${idioma} · Hash: ${window.location.hash || "(buit)"}`;
}
function actualitzar() {
    mostrarLocation();
    mostrarHistory();
    mostrarVista();
}
function modificarUrl(metode, estat, url, descripcio) {
    try {
        if (metode === "pushState") {
            window.history.pushState(estat, "", url);
        }
        else {
            window.history.replaceState(estat, "", url);
        }
        afegirLog(`${metode}(${JSON.stringify(estat)}, "", "${url}") · ${descripcio}`);
    }
    catch (error) {
        const missatge = error instanceof Error ? error.message : String(error);
        afegirLog(`${metode} ha fallat (${missatge}). S'usa location.assign() com a alternativa.`);
        window.location.assign(url);
        return;
    }
    actualitzar();
}
function aplicarQuery() {
    const clau = queryClau.value.trim();
    if (clau === "") {
        afegirLog("Cal escriure una clau de consulta.");
        return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set(clau, queryValor.value);
    modificarUrl("pushState", { accio: "query", clau }, url.href, `query ${clau}`);
}
function aplicarHash() {
    const valor = hashInput.value.trim().replace(/^#/, "");
    const url = new URL(window.location.href);
    url.hash = valor;
    modificarUrl("pushState", { accio: "hash", valor }, url.href, `hash #${valor}`);
}
function canviarVista(vista, metode) {
    const url = new URL(window.location.href);
    url.searchParams.set("vista", vista);
    modificarUrl(metode, { vista }, url.href, `vista «${vista}» amb ${metode}`);
}
function netejarQuery() {
    const url = new URL(window.location.href);
    url.search = "";
    modificarUrl("pushState", {}, url.href, "sense query string");
}
function actualitzarInputsDesDeLaUrl() {
    const params = new URLSearchParams(window.location.search);
    queryClau.value = params.get("vista") ?? "";
    queryValor.value = params.get("lang") ?? "";
    hashInput.value = window.location.hash.replace(/^#/, "");
}
document.getElementById("btnQuery")?.addEventListener("click", aplicarQuery);
document.getElementById("btnHash")?.addEventListener("click", aplicarHash);
document.getElementById("btnVistaA")?.addEventListener("click", () => canviarVista("a", "pushState"));
document.getElementById("btnVistaB")?.addEventListener("click", () => canviarVista("b", "pushState"));
document.getElementById("btnReplace")?.addEventListener("click", () => canviarVista("reemplacada", "replaceState"));
document.getElementById("btnNetejar")?.addEventListener("click", netejarQuery);
document.getElementById("btnBack")?.addEventListener("click", () => {
    afegirLog("history.back()");
    window.history.back();
});
document.getElementById("btnForward")?.addEventListener("click", () => {
    afegirLog("history.forward()");
    window.history.forward();
});
document.getElementById("btnGo2")?.addEventListener("click", () => {
    afegirLog("history.go(-2)");
    window.history.go(-2);
});
document.getElementById("btnReload")?.addEventListener("click", () => {
    afegirLog("location.reload()");
    window.location.reload();
});
window.addEventListener("popstate", (event) => {
    afegirLog(`Esdeveniment popstate · state=${JSON.stringify(event.state)}`);
    actualitzar();
});
window.addEventListener("hashchange", () => {
    afegirLog(`Esdeveniment hashchange · hash=${window.location.hash || "(buit)"}`);
    actualitzar();
});
actualitzarInputsDesDeLaUrl();
actualitzar();
afegirLog("Exercici 5 carregat. Prova els botons i mira com canvia la URL.");
export {};
//# sourceMappingURL=app.js.map