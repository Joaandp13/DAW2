// Utilitats comunes per connectar els exercicis amb les pàgines HTML.

/** Funció que mostra un text (a la consola i dins del <pre> de l'exercici). */
export type Sortida = (text: string) => void;

/** Escapa els caràcters especials d'HTML (evita injectar codi des dels formularis). */
export function escapeHtml(text: string): string {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

/** Busca un element pel seu id i llença un error si no existeix. */
export function obtenir<T extends HTMLElement = HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) throw new Error("No existeix l'element #" + id);
    return element as T;
}

/**
 * Connecta el botó #btn-<id> amb una acció. El resultat es mostra al <pre id="out-<id>">.
 * Si l'acció llença una excepció, es mostra el missatge d'error.
 */
export function exercici(id: string, accio: (out: Sortida) => void): void {
    const boto = document.getElementById("btn-" + id);
    const pre = document.getElementById("out-" + id);
    boto?.addEventListener("click", () => {
        if (pre) pre.textContent = "";
        const out: Sortida = (text) => {
            console.log(text);
            if (pre) pre.textContent += text + "\n";
        };
        try {
            accio(out);
        } catch (e) {
            out("⚠ " + (e instanceof Error ? e.message : String(e)));
        }
    });
}

/** Igual que exercici(), però l'acció retorna HTML que es posa dins del <div id="out-<id>">. */
export function exerciciHtml(id: string, accio: () => string): void {
    const boto = document.getElementById("btn-" + id);
    const div = document.getElementById("out-" + id);
    boto?.addEventListener("click", () => {
        try {
            if (div) div.innerHTML = accio();
        } catch (e) {
            if (div) div.textContent = "⚠ " + (e instanceof Error ? e.message : String(e));
        }
    });
}

/** Mesura (en ms) el temps que triga una funció. */
export function cronometrar(f: () => void): number {
    const inici = performance.now();
    f();
    return performance.now() - inici;
}
