function enter(valor, nom) {
    if (!Number.isInteger(valor))
        throw new TypeError(`${nom} ha de ser un enter`);
    return valor;
}
export function comptador(ini, inc, inf = -Infinity, sup = Infinity) {
    enter(ini, "ini");
    if (enter(inc, "inc") <= 0)
        throw new RangeError("inc ha de ser positiu");
    let valor = ini;
    let increment = inc;
    let inferior = inf;
    let superior = sup;
    const ajustar = () => (valor = Math.min(Math.max(valor, inferior), superior));
    const ordenarLimits = () => { if (inferior > superior)
        [inferior, superior] = [superior, inferior]; };
    ordenarLimits();
    ajustar();
    return {
        finc() { valor += increment; return ajustar(); },
        fdec() { valor -= increment; return ajustar(); },
        limit(i, s) { inferior = enter(i, "inf"); superior = enter(s, "sup"); ordenarLimits(); return ajustar(); },
        set(i, n) {
            if (i !== undefined)
                valor = enter(i, "ini");
            if (n !== undefined) {
                if (enter(n, "inc") <= 0)
                    throw new RangeError("inc ha de ser positiu");
                increment = n;
            }
            return ajustar();
        },
    };
}
//# sourceMappingURL=Comptador.js.map