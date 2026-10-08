// FUNCIONS (ex. 6-7): anagrames i paraules amb unes lletres
import { diccio } from "../Llistes/Diccionari.js";
import { transformar } from "../comu/text.js";

/** Lletres d'una paraula ordenades: dues paraules són anagrames si tenen la mateixa clau. */
const clau = (w: string): string => [...w].sort().join("");

/** Troba els anagrames de `w` dins del diccionari (no inclou la mateixa paraula). */
export function anagrames(w: string): string[] {
    const paraula = transformar(w);
    if (!diccio.diccionari.includes(paraula)) throw new Error("Aquesta paraula no està en el diccionari.");
    const k = clau(paraula);
    return diccio.diccionari.filter((p) => p !== paraula && p.length === paraula.length && clau(p) === k);
}

/** Compta quantes vegades apareix cada lletra. */
function comptarLletres(text: string): Map<string, number> {
    const mapa = new Map<string, number>();
    for (const c of text) mapa.set(c, (mapa.get(c) ?? 0) + 1);
    return mapa;
}

/** true si `paraula` es pot formar amb les lletres disponibles (sense repetir-ne cap de més). */
function esPotFer(paraula: string, disponibles: Map<string, number>): boolean {
    const necessaries = comptarLletres(paraula);
    for (const [lletra, vegades] of necessaries) {
        if ((disponibles.get(lletra) ?? 0) < vegades) return false;
    }
    return true;
}

/** Les paraules MÉS LLARGUES que es poden fer amb les lletres donades. */
export function paraulesAmb(lletres: string): string[] {
    const disponibles = comptarLletres(transformar(lletres));
    let max = 0;
    let resultat: string[] = [];
    for (const p of diccio.diccionari) {
        if (p.length < max || !esPotFer(p, disponibles)) continue;
        if (p.length > max) { max = p.length; resultat = []; }
        resultat.push(p);
    }
    return resultat;
}
