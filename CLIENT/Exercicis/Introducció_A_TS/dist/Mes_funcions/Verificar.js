import { preuFinal, calcularMitjana } from "../Funcions/Basiques.js";
import { comptador } from "./Comptador.js";
function iguals(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
export function verificar(nom, obtingut, esperat) {
    return { nom, correcte: iguals(obtingut, esperat), esperat, obtingut };
}
export function informe(proves, out) {
    for (const p of proves) {
        out(`${p.correcte ? "✔" : "✖"} ${p.nom}` + (p.correcte ? "" : ` (esperat ${JSON.stringify(p.esperat)}, obtingut ${JSON.stringify(p.obtingut)})`));
    }
    const ok = proves.filter((p) => p.correcte).length;
    out(`\n${ok} de ${proves.length} proves correctes`);
}
export function invertirParaules(frase) {
    return frase.trim().split(/\s+/).reverse().join(" ");
}
export function executarProves() {
    const c = comptador(10, 5, 0, 20);
    const proves = [
        verificar("preuFinal(100, 10, 21, true) = 108.9", preuFinal(100, 10, 21, true), 108.9),
        verificar("preuFinal amb dada no numèrica = undefined", preuFinal(100, NaN, 21, true), undefined),
        verificar("calcularMitjana(2, 4, 6) = 4", calcularMitjana(2, 4, 6), 4),
        verificar("comptador: finc() 10 -> 15", c.finc(), 15),
        verificar("comptador: finc() 15 -> 20", c.finc(), 20),
        verificar("comptador: finc() no supera el límit 20", c.finc(), 20),
        verificar("comptador: fdec() 20 -> 15", c.fdec(), 15),
        verificar("invertirParaules('un dos tres') = 'tres dos un'", invertirParaules("un dos tres"), "tres dos un"),
        verificar("(prova que falla expressament)", invertirParaules("a b"), "a b"),
    ];
    return proves;
}
//# sourceMappingURL=Verificar.js.map