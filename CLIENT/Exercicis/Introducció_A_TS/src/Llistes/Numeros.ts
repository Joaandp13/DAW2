// LLISTES (exercicis 8-11): arrays de números
import type { Sortida } from "../comu/ui.js";

// ---------------------------------------------------------------
// 8 - Array de números enters aleatoris
// ---------------------------------------------------------------
/** n enters aleatoris entre 0 i 1.000.000 (aquest últim no inclòs). */
export function crearArrayNumeros(n: number): number[] {
    if (!Number.isInteger(n) || n <= 0) throw new RangeError("n ha de ser un enter positiu");
    const resultat: number[] = [];
    for (let i = 0; i < n; ++i) resultat.push(Math.floor(Math.random() * 1_000_000));
    return resultat;
}

export function ex8(out: Sortida): void {
    out(crearArrayNumeros(10).join(", "));
}

// ---------------------------------------------------------------
// 9 - filter(): parells i imparells
// ---------------------------------------------------------------
export const esImparell = (n: number): boolean => n % 2 !== 0;
export const esParell = (n: number): boolean => n % 2 === 0;

export function separarParellsImparells(numeros: number[]): { parells: number[]; imparells: number[] } {
    return { parells: numeros.filter(esParell), imparells: numeros.filter(esImparell) };
}

export function ex9(out: Sortida): void {
    const { parells, imparells } = separarParellsImparells(crearArrayNumeros(1000));
    out(`Imparells (${imparells.length}), els 10 primers: ${imparells.slice(0, 10).join(", ")}`);
    out(`Parells (${parells.length}), els 10 primers: ${parells.slice(0, 10).join(", ")}`);
}

// ---------------------------------------------------------------
// 10 - Imparells primer, parells després (cadascun ordenat)
// ---------------------------------------------------------------
/** OJO: sort() sense funció ordena com a TEXT ("100" < "9"). Cal passar (a, b) => a - b. */
export function imparellsAbansParells(numeros: number[]): number[] {
    const { parells, imparells } = separarParellsImparells(numeros);
    return imparells.sort((a, b) => a - b).concat(parells.sort((a, b) => a - b));
}

export function ex10(out: Sortida): void {
    out(imparellsAbansParells(crearArrayNumeros(10)).join(", "));
}

// ---------------------------------------------------------------
// 11 - map(), some() i every()
// ---------------------------------------------------------------
/** Suma els dígits repetidament fins que en queda un de sol (arrel digital). */
export function arrelDigital(n: number): number {
    let s = String(n);
    while (s.length > 1) {
        s = String([...s].reduce((suma, c) => suma + Number(c), 0));
    }
    return Number(s);
}

/** Segons l'arrel digital, suma 21 (0,3,6,9), 29 (1,4,7) o 37 (2,5,8) al número. */
export function calcularCuriositat(n: number): number {
    switch (arrelDigital(n) % 3) {
        case 0: return n + 21;
        case 1: return n + 29;
        default: return n + 37;
    }
}

export const esMultiple3 = (n: number): boolean => n % 3 === 0;

export function ex11(out: Sortida): void {
    const numeros = crearArrayNumeros(1000);
    const resultat = numeros.map(calcularCuriositat);
    out("Original -> resultat (10 primers):");
    for (let i = 0; i < 10; ++i) out(`${numeros[i]} -> ${resultat[i]}`);
    out(`every(multiple de 3): ${resultat.every(esMultiple3)}`);
    out(`some(multiple de 3): ${resultat.some(esMultiple3)}`);
}
