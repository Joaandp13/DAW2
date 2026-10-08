export function crearArrayNumeros(n) {
    if (!Number.isInteger(n) || n <= 0)
        throw new RangeError("n ha de ser un enter positiu");
    const resultat = [];
    for (let i = 0; i < n; ++i)
        resultat.push(Math.floor(Math.random() * 1_000_000));
    return resultat;
}
export function ex8(out) {
    out(crearArrayNumeros(10).join(", "));
}
export const esImparell = (n) => n % 2 !== 0;
export const esParell = (n) => n % 2 === 0;
export function separarParellsImparells(numeros) {
    return { parells: numeros.filter(esParell), imparells: numeros.filter(esImparell) };
}
export function ex9(out) {
    const { parells, imparells } = separarParellsImparells(crearArrayNumeros(1000));
    out(`Imparells (${imparells.length}), els 10 primers: ${imparells.slice(0, 10).join(", ")}`);
    out(`Parells (${parells.length}), els 10 primers: ${parells.slice(0, 10).join(", ")}`);
}
export function imparellsAbansParells(numeros) {
    const { parells, imparells } = separarParellsImparells(numeros);
    return imparells.sort((a, b) => a - b).concat(parells.sort((a, b) => a - b));
}
export function ex10(out) {
    out(imparellsAbansParells(crearArrayNumeros(10)).join(", "));
}
export function arrelDigital(n) {
    let s = String(n);
    while (s.length > 1) {
        s = String([...s].reduce((suma, c) => suma + Number(c), 0));
    }
    return Number(s);
}
export function calcularCuriositat(n) {
    switch (arrelDigital(n) % 3) {
        case 0: return n + 21;
        case 1: return n + 29;
        default: return n + 37;
    }
}
export const esMultiple3 = (n) => n % 3 === 0;
export function ex11(out) {
    const numeros = crearArrayNumeros(1000);
    const resultat = numeros.map(calcularCuriositat);
    out("Original -> resultat (10 primers):");
    for (let i = 0; i < 10; ++i)
        out(`${numeros[i]} -> ${resultat[i]}`);
    out(`every(multiple de 3): ${resultat.every(esMultiple3)}`);
    out(`some(multiple de 3): ${resultat.some(esMultiple3)}`);
}
//# sourceMappingURL=Numeros.js.map