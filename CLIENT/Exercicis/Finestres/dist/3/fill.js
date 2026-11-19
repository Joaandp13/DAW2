const info = document.getElementById("info");
const registre = document.getElementById("log");
function afegirLog(text) {
    const hora = new Date().toLocaleTimeString("ca-ES");
    const li = document.createElement("li");
    li.textContent = `[${hora}] ${text}`;
    registre.prepend(li);
}
function actualitzarInfo() {
    const opener = window.opener;
    info.textContent = [
        `window.name: ${window.name === "" ? "(buit)" : window.name}`,
        `window.opener: ${opener === null ? "null" : "definit"}`,
        `self === window: ${window.self === window}`,
        `top === window: ${window.top === window}`,
        `parent === window: ${window.parent === window}`,
        `innerWidth × innerHeight: ${window.innerWidth} × ${window.innerHeight}`,
        `outerWidth × outerHeight: ${window.outerWidth} × ${window.outerHeight}`,
        `screenX × screenY: ${window.screenX} × ${window.screenY}`,
        `location.href: ${window.location.href}`,
        `location.origin: ${window.location.origin}`,
    ].join("\n");
}
document.getElementById("btnOpener")?.addEventListener("click", () => {
    const opener = window.opener;
    if (opener === null) {
        afegirLog("Aquesta finestra no té cap opener.");
        return;
    }
    try {
        opener.focus();
        afegirLog("S'ha cridat opener.focus() des de la finestra filla.");
    }
    catch (error) {
        const missatge = error instanceof Error ? error.message : String(error);
        afegirLog(`No s'ha pogut enfocar l'opener: ${missatge}`);
    }
});
document.getElementById("btnTancar")?.addEventListener("click", () => {
    afegirLog("S'ha cridat window.close() des de la mateixa finestra.");
    window.close();
});
document.getElementById("btnMides")?.addEventListener("click", () => {
    actualitzarInfo();
    afegirLog("S'han tornat a llegir les mides de la finestra.");
});
window.addEventListener("resize", actualitzarInfo);
actualitzarInfo();
afegirLog("Finestra filla carregada. Té accés a window.opener gràcies al window.open() del pare.");
export {};
//# sourceMappingURL=fill.js.map