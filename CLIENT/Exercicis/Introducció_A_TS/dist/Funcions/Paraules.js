import { diccio } from "../Llistes/Diccionari.js";
import { transformar } from "../comu/text.js";
const clau = (w) => [...w].sort().join("");
export function anagrames(w) {
    const paraula = transformar(w);
    if (!diccio.diccionari.includes(paraula))
        throw new Error("Aquesta paraula no està en el diccionari.");
    const k = clau(paraula);
    return diccio.diccionari.filter((p) => p !== paraula && p.length === paraula.length && clau(p) === k);
}
function comptarLletres(text) {
    const mapa = new Map();
    for (const c of text)
        mapa.set(c, (mapa.get(c) ?? 0) + 1);
    return mapa;
}
function esPotFer(paraula, disponibles) {
    const necessaries = comptarLletres(paraula);
    for (const [lletra, vegades] of necessaries) {
        if ((disponibles.get(lletra) ?? 0) < vegades)
            return false;
    }
    return true;
}
export function paraulesAmb(lletres) {
    const disponibles = comptarLletres(transformar(lletres));
    let max = 0;
    let resultat = [];
    for (const p of diccio.diccionari) {
        if (p.length < max || !esPotFer(p, disponibles))
            continue;
        if (p.length > max) {
            max = p.length;
            resultat = [];
        }
        resultat.push(p);
    }
    return resultat;
}
//# sourceMappingURL=Paraules.js.map