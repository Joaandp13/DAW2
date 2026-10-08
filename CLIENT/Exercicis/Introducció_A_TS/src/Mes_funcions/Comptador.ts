// MÉS FUNCIONS (ex. 5): comptadors personalitzats amb clausures

export interface Comptador {
    finc(): number;                              // incrementa
    fdec(): number;                              // decrementa
    limit(inf: number, sup: number): number;     // canvia els límits
    set(ini?: number, inc?: number): number;     // canvia el valor i/o l'increment
}

function enter(valor: number, nom: string): number {
    if (!Number.isInteger(valor)) throw new TypeError(`${nom} ha de ser un enter`);
    return valor;
}

/**
 * Crea un comptador independent. Les variables valor, increment, inferior i superior
 * queden "tancades" dins la clausura: només es poden tocar amb les funcions retornades.
 */
export function comptador(ini: number, inc: number, inf = -Infinity, sup = Infinity): Comptador {
    enter(ini, "ini");
    if (enter(inc, "inc") <= 0) throw new RangeError("inc ha de ser positiu");

    let valor = ini;
    let increment = inc;
    let inferior = inf;
    let superior = sup;

    /** Deixa el valor dins dels límits. */
    const ajustar = (): number => (valor = Math.min(Math.max(valor, inferior), superior));
    /** Si els límits estan al revés, els intercanvia. */
    const ordenarLimits = (): void => { if (inferior > superior) [inferior, superior] = [superior, inferior]; };

    ordenarLimits();
    ajustar();

    return {
        finc() { valor += increment; return ajustar(); },
        fdec() { valor -= increment; return ajustar(); },
        limit(i, s) { inferior = enter(i, "inf"); superior = enter(s, "sup"); ordenarLimits(); return ajustar(); },
        set(i, n) {
            if (i !== undefined) valor = enter(i, "ini");
            if (n !== undefined) { if (enter(n, "inc") <= 0) throw new RangeError("inc ha de ser positiu"); increment = n; }
            return ajustar();
        },
    };
}
