// MÉS FUNCIONS (ex. 3): mini programa de verificació
// (No tinc els teus Verificar.js / VerificarCiencies.js / VerificarLletres.js, així que això és una versió pròpia i senzilla.)
import type { Sortida } from "../comu/ui.js";
import { preuFinal, calcularMitjana } from "../Funcions/Basiques.js";
import { comptador } from "./Comptador.js";

export interface ResultatProva { nom: string; correcte: boolean; esperat: unknown; obtingut: unknown; }

/** Compara dos valors qualssevol (també arrays i objectes) convertint-los a JSON. */
function iguals(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

/** Una prova: compara el resultat obtingut amb l'esperat. */
export function verificar(nom: string, obtingut: unknown, esperat: unknown): ResultatProva {
    return { nom, correcte: iguals(obtingut, esperat), esperat, obtingut };
}

/** Mostra cada prova (✔/✖) i un resum final. */
export function informe(proves: ResultatProva[], out: Sortida): void {
    for (const p of proves) {
        out(`${p.correcte ? "✔" : "✖"} ${p.nom}` + (p.correcte ? "" : ` (esperat ${JSON.stringify(p.esperat)}, obtingut ${JSON.stringify(p.obtingut)})`));
    }
    const ok = proves.filter((p) => p.correcte).length;
    out(`\n${ok} de ${proves.length} proves correctes`);
}

// ---- Mini exercici OPCIONAL: invertir l'ordre de les paraules d'una frase ----
export function invertirParaules(frase: string): string {
    return frase.trim().split(/\s+/).reverse().join(" ");
}

export function executarProves(): ResultatProva[] {
    const c = comptador(10, 5, 0, 20);
    const proves: ResultatProva[] = [
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
