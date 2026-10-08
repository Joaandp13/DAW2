// FUNCIONS (ex. 1-4): retorn de valors, execució retardada, arguments indefinits i BigInt

// ---------------------------------------------------------------
// 1 - Retornar text o número (sobrecàrrega de funcions)
// ---------------------------------------------------------------
// Signatures de sobrecàrrega: segons el valor de `num`, TypeScript sap quin tipus es retorna.
export function preuFinal(preuBase: number, tpcDte: number, tpcIva: number, num: true): number | undefined;
export function preuFinal(preuBase: number, tpcDte: number, tpcIva: number, num: false): string | undefined;
export function preuFinal(preuBase: number, tpcDte: number, tpcIva: number, num: boolean): number | string | undefined;
export function preuFinal(preuBase: number, tpcDte: number, tpcIva: number, num: boolean): number | string | undefined {
    // Si alguna dada no és numèrica, retorna undefined
    if ([preuBase, tpcDte, tpcIva].some((v) => typeof v !== "number" || Number.isNaN(v))) return undefined;

    const sensePreuIva = preuBase - (preuBase * tpcDte) / 100;
    const preu = sensePreuIva + (sensePreuIva * tpcIva) / 100;

    if (num) return preu;
    return preu.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

// ---------------------------------------------------------------
// 2 - Execució retardada (funcions com a paràmetre)
// ---------------------------------------------------------------
/** Executa `funcio(...args)` després de `segons` segons. Els tipus dels args es dedueixen de `funcio`. */
export function funcioAmbRetard<A extends unknown[]>(funcio: (...args: A) => void, segons: number, ...args: A): void {
    setTimeout(funcio, segons * 1000, ...args);
}

// ---------------------------------------------------------------
// 3 - Mitjana indefinida (paràmetres rest)
// ---------------------------------------------------------------
/** Mitjana de tots els arguments numèrics. Els valors que no són números s'ignoren. */
export function calcularMitjana(...valors: (number | string)[]): number {
    const nums = valors.map((v) => (typeof v === "number" ? v : parseFloat(v))).filter((n) => !Number.isNaN(n));
    return nums.length === 0 ? 0 : nums.reduce((t, n) => t + n, 0) / nums.length;
}

// ---------------------------------------------------------------
// 4 - PI amb n decimals (BigInt + fórmula de Machin)
// ---------------------------------------------------------------
// PI = 4 * (4 * arctan(1/5) - arctan(1/239))
// Es treballa amb enters enormes: el número es multiplica per 10^decimals i s'opera sense decimals.
function arctanInvers(d: bigint, digits: bigint): bigint {
    let total = 10n ** digits / d;
    let terme = total;
    let n = 0n;
    while (terme !== 0n) {
        n += 1n;
        terme /= -(d * d);
        total += terme / (2n * n + 1n);
    }
    return total;
}

/** Retorna PI com a text amb `decimals` decimals (100 per defecte). */
export function pi(decimals = 100): string {
    if (!Number.isInteger(decimals) || decimals < 1) throw new RangeError("decimals ha de ser un enter >= 1");
    const guarda = 10n; // xifres extra per absorbir els errors d'arrodoniment
    const digits = BigInt(decimals) + guarda;
    let valor = 4n * (4n * arctanInvers(5n, digits) - arctanInvers(239n, digits));
    valor /= 10n ** guarda;
    const text = valor.toString();
    return text[0] + "." + text.slice(1);
}
