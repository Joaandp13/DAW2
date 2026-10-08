// LLISTES (exercicis 1-7): arrays de paraules
import { diccio } from "./Diccionari.js";
import { cronometrar } from "../comu/ui.js";
import type { Sortida } from "../comu/ui.js";

/** Màxim de línies de detall que es mostren (per no omplir la pantalla). */
const MAX_LINIES = 15;

// ---------------------------------------------------------------
// 1 - Array amb paraules aleatòries
// ---------------------------------------------------------------
/** Retorna un array amb n paraules agafades a l'atzar del diccionari. */
export function crearArrayParaules(n: number): string[] {
    if (!Number.isInteger(n) || n <= 0) throw new RangeError("n ha de ser un enter positiu");
    const dic = diccio.diccionari;
    const resultat: string[] = [];
    for (let i = 0; i < n; ++i) {
        resultat.push(dic[Math.floor(Math.random() * dic.length)]);
    }
    return resultat;
}

export function ex1(out: Sortida): void {
    out(crearArrayParaules(10).join("\n----------\n"));
}

// ---------------------------------------------------------------
// 2 - Repetides en un array SENSE ordenar (indexOf + splice)
// ---------------------------------------------------------------
/** Elimina les paraules repetides de l'array (el modifica) i retorna quantes n'ha eliminat. */
export function eliminarRepetides(paraules: string[], out?: Sortida): number {
    let repetides = 0;
    for (let i = 0; i < paraules.length - 1; ++i) {
        let ndx: number;
        // indexOf(valor, desde): busca només a partir de la posició i + 1
        while ((ndx = paraules.indexOf(paraules[i], i + 1)) >= 0) {
            if (repetides < MAX_LINIES) out?.(`${paraules[i]} repetida a la posició ${ndx}`);
            paraules.splice(ndx, 1);
            ++repetides;
        }
    }
    return repetides;
}

export function ex2(out: Sortida): void {
    const paraules = crearArrayParaules(1000);
    let repetides = 0;
    const ms = cronometrar(() => { repetides = eliminarRepetides(paraules, out); });
    out(`... (només es mostren les ${MAX_LINIES} primeres)`);
    out(`S'han trobat ${repetides} paraules repetides`);
    out(`Ara l'array conté ${paraules.length} paraules diferents`);
    out(`Temps: ${ms.toFixed(3)} ms`);
}

// ---------------------------------------------------------------
// 3 - Repetides en un array ORDENAT (dos punters, sense splice)
// ---------------------------------------------------------------
/**
 * Ordena l'array i elimina repetides recorrent-lo UNA sola vegada (O(n)).
 * Mentre es llegeix, es va escrivint al principi només el que no està repetit.
 */
export function eliminarRepetidesOrdenat(paraules: string[], out?: Sortida): number {
    if (paraules.length === 0) return 0;
    paraules.sort();
    let repetides = 0;
    let escriure = 1;
    for (let llegir = 1; llegir < paraules.length; ++llegir) {
        if (paraules[llegir] !== paraules[escriure - 1]) {
            paraules[escriure++] = paraules[llegir];
        } else {
            if (repetides < MAX_LINIES) out?.(`${paraules[llegir]} repetida (posició original ${llegir})`);
            ++repetides;
        }
    }
    paraules.length = escriure;
    return repetides;
}

export function ex3(out: Sortida): void {
    const paraules = crearArrayParaules(1000);
    let repetides = 0;
    const ms = cronometrar(() => { repetides = eliminarRepetidesOrdenat(paraules, out); });
    out(`... (només es mostren les ${MAX_LINIES} primeres)`);
    out(`S'han trobat ${repetides} paraules repetides`);
    out(`Ara l'array conté ${paraules.length} paraules diferents`);
    out(`Temps: ${ms.toFixed(3)} ms`);
}

// ---------------------------------------------------------------
// 4 - Cerca lineal (array sense ordenar)
// ---------------------------------------------------------------
/** Retorna la posició de la paraula o -1 si no hi és. */
export function buscarLineal(array: string[], text: string): number {
    return array.indexOf(text);
}

export function ex4(out: Sortida): void {
    const N = 1000;
    const paraules = crearArrayParaules(N);
    const dic = diccio.diccionari;
    let trobades = 0;
    const ms = cronometrar(() => {
        for (let i = 0; i < N; ++i) {
            const w = dic[Math.floor(Math.random() * dic.length)];
            const ndx = buscarLineal(paraules, w);
            if (ndx >= 0) {
                if (trobades < MAX_LINIES) out(`${w} ${ndx}`);
                ++trobades;
            }
        }
    });
    out(`Trobades: ${trobades} de ${N} · Temps: ${ms.toFixed(3)} ms`);
}

// ---------------------------------------------------------------
// 5 - Cerca binària (array ordenat)
// ---------------------------------------------------------------
/** Cerca binària: va descartant la meitat de l'array a cada pas. Retorna la posició o -1. */
export function buscarBinari(array: string[], text: string): number {
    let min = 0;
    let max = array.length - 1;
    while (min <= max) {
        const mid = Math.floor((min + max) / 2);
        if (array[mid] < text) min = mid + 1;
        else if (array[mid] > text) max = mid - 1;
        else return mid;
    }
    return -1;
}

export function ex5(out: Sortida): void {
    const N = 1000;
    const paraules = crearArrayParaules(N).sort();
    const dic = diccio.diccionari;
    let trobades = 0;
    const ms = cronometrar(() => {
        for (let i = 0; i < N; ++i) {
            const w = dic[Math.floor(Math.random() * dic.length)];
            const ndx = buscarBinari(paraules, w);
            if (ndx >= 0) {
                if (trobades < MAX_LINIES) out(`${w} ${ndx}`);
                ++trobades;
            }
        }
    });
    out(`Trobades: ${trobades} de ${N} · Temps: ${ms.toFixed(3)} ms`);
}

// ---------------------------------------------------------------
// 6 - Ordenació personalitzada amb sort()
// ---------------------------------------------------------------
/** Primer per llargada (creixent); si empaten, alfabèticament en ordre invers. */
export function ordenarLenInv(a: string, b: string): number {
    if (a.length !== b.length) return a.length - b.length;
    return a < b ? 1 : a > b ? -1 : 0;
}

export function ex6(out: Sortida): void {
    const paraules = crearArrayParaules(1000).sort(ordenarLenInv);
    out(paraules.slice(0, 40).join("\n"));
    out("... (només les 40 primeres de 1000)");
}

// ---------------------------------------------------------------
// 7 - Cerca amb patró (? = una lletra, * = 0 o més lletres)
// ---------------------------------------------------------------
/** Retorna les paraules del diccionari que encaixen amb el patró. */
export function cercarPerPatro(patro: string): string[] {
    const p = patro.toUpperCase();
    if (!/^[A-ZÑ?*]+$/.test(p)) throw new Error("El patró només pot contenir lletres, ? i *");
    const regex = new RegExp("^" + p.replaceAll("?", ".").replaceAll("*", ".*") + "$");
    return diccio.diccionari.filter((w) => regex.test(w));
}
