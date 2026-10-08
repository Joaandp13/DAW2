// FUNCIONS (ex. 5): la frase oculta
import { diccio } from "../Llistes/Diccionari.js";
import { transformar } from "../comu/text.js";

export const FRASES = [
    "A CABALLO REGALADO NO LE MIRES EL DIENTE",
    "MAS VALE PAJARO EN MANO QUE CIENTO VOLANDO",
    "NO HAY MAL QUE POR BIEN NO VENGA",
    "AL MAL TIEMPO BUENA CARA",
    "QUIEN BUSCA ENCUENTRA",
    "EN BOCA CERRADA NO ENTRAN MOSCAS",
    "OJOS QUE NO VEN CORAZON QUE NO SIENTE",
];

export interface EstatJoc {
    frase: string;
    dites: Set<string>;     // lletres que s'han dit
    endevinada: boolean;
}

/** Només es poden utilitzar frases amb TOTES les paraules al diccionari. */
export function frasesValides(frases: string[] = FRASES): string[] {
    const dic = new Set(diccio.diccionari);
    return frases.filter((f) => f.split(" ").every((p) => dic.has(p)));
}

export function novaPartida(frases: string[] = frasesValides()): EstatJoc {
    if (frases.length === 0) throw new Error("Cap frase té totes les paraules al diccionari");
    return { frase: frases[Math.floor(Math.random() * frases.length)], dites: new Set(), endevinada: false };
}

/** Lletres amagades amb ? i espais amb _ */
export function mostrarFrase(e: EstatJoc): string {
    return [...e.frase].map((c) => (c === " " ? "_" : e.endevinada || e.dites.has(c) ? c : "?")).join("");
}

/** Diu una lletra. Retorna quantes vegades apareix a la frase. */
export function dirLletra(e: EstatJoc, lletra: string): number {
    const l = transformar(lletra.trim());
    if (!/^[A-ZÑ]$/.test(l)) throw new Error("Escriu una sola lletra");
    e.dites.add(l);
    return [...e.frase].filter((c) => c === l).length;
}

/** Intenta endevinar la frase sencera. */
export function endevinar(e: EstatJoc, intent: string): boolean {
    const ok = transformar(intent).replace(/\s+/g, " ").trim() === e.frase;
    if (ok) e.endevinada = true;
    return ok;
}

/** true si ja s'han descobert totes les lletres. */
export function completada(e: EstatJoc): boolean {
    return e.endevinada || [...e.frase].every((c) => c === " " || e.dites.has(c));
}

/** Una paraula del diccionari encaixa amb el patró si coincideixen les lletres visibles
 *  i, a les posicions amb ?, la lletra NO ha estat dita (sinó s'hauria vist). */
function encaixa(paraula: string, patro: string, dites: Set<string>): boolean {
    if (paraula.length !== patro.length) return false;
    for (let i = 0; i < patro.length; ++i) {
        if (patro[i] === "?" ? dites.has(paraula[i]) : paraula[i] !== patro[i]) return false;
    }
    return true;
}

/**
 * Intenta completar la frase només si n'està COMPLETAMENT segur:
 * cada paraula ha de tenir una única candidata al diccionari. Si no, retorna null.
 */
export function ajudaCompletar(e: EstatJoc): string | null {
    const trobades: string[] = [];
    for (const patro of mostrarFrase(e).split("_")) {
        const candidates = diccio.diccionari.filter((p) => encaixa(p, patro, e.dites));
        if (candidates.length !== 1) return null;
        trobades.push(candidates[0]);
    }
    return trobades.join(" ");
}
