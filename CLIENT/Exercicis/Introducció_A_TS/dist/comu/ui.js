export function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}
export function obtenir(id) {
    const element = document.getElementById(id);
    if (!element)
        throw new Error("No existeix l'element #" + id);
    return element;
}
export function exercici(id, accio) {
    const boto = document.getElementById("btn-" + id);
    const pre = document.getElementById("out-" + id);
    boto?.addEventListener("click", () => {
        if (pre)
            pre.textContent = "";
        const out = (text) => {
            console.log(text);
            if (pre)
                pre.textContent += text + "\n";
        };
        try {
            accio(out);
        }
        catch (e) {
            out("⚠ " + (e instanceof Error ? e.message : String(e)));
        }
    });
}
export function exerciciHtml(id, accio) {
    const boto = document.getElementById("btn-" + id);
    const div = document.getElementById("out-" + id);
    boto?.addEventListener("click", () => {
        try {
            if (div)
                div.innerHTML = accio();
        }
        catch (e) {
            if (div)
                div.textContent = "⚠ " + (e instanceof Error ? e.message : String(e));
        }
    });
}
export function cronometrar(f) {
    const inici = performance.now();
    f();
    return performance.now() - inici;
}
//# sourceMappingURL=ui.js.map