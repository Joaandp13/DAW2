// MÉS FUNCIONS (ex. 4): expedients amb funcions anònimes, lambdes i clausures
import { crearExpedients, taulaAlumnes, ordenarAlumnes, MODULS_CICLE } from "../Objectes/Expedients.js";
import type { Alumne, Modul } from "../Objectes/Expedients.js";
import { getObjectsByValue } from "../Objectes/Cerca.js";

// 1) Funció ANÒNIMA: totes les notes (UF) del mòdul estan aprovades?
export const totesAprovades = function (m: Modul): boolean {
    return !m.notes.some(function (n) { return n < 5; });
};

// 2) Funció ANÒNIMA: suma totes les notes
export const sumarNotes = function (notes: number[]): number {
    return notes.reduce(function (total, n) { return total + n; }, 0);
};

// 3) LAMBDA (arrow function): tots els mòduls tenen nota final?
export const totsModulsAprovats = (a: Alumne): boolean =>
    MODULS_CICLE.every((nom) => getObjectsByValue(a.moduls, "nom", nom)[0]?.notaModul !== undefined);

// 4) LAMBDA: suma les notes dels mòduls
export const sumarNotesModuls = (a: Alumne): number => a.moduls.reduce((t, m) => t + (m.notaModul ?? 0), 0);

// 5) CLAUSURA: retorna una funció per filtrar matriculats (o no) en un mòdul concret.
//    La funció interna "recorda" nomModul i matriculat encara que filtrarModul ja hagi acabat.
export function filtrarModul(nomModul: string, matriculat: boolean): (alumne: Alumne) => boolean {
    return (alumne) => (getObjectsByValue(alumne.moduls, "nom", nomModul).length > 0) === matriculat;
}

/** Calcula notes amb les funcions anteriors (mateix resultat que a Objectes, però en estil funcional). */
export function calcularFuncional(expedients: Alumne[]): void {
    for (const a of expedients) {
        for (const m of a.moduls) {
            if (totesAprovades(m)) m.notaModul = sumarNotes(m.notes) / m.notes.length;
        }
        if (totsModulsAprovats(a)) a.notaFinal = sumarNotesModuls(a) / a.moduls.length;
    }
}

export function demoExpedients(): string {
    const expedients = crearExpedients();
    calcularFuncional(expedients);
    expedients.sort(ordenarAlumnes);
    const filtreM02 = filtrarModul("M02", true);
    const filtreNoM03 = filtrarModul("M03", false);
    return "<p>Tots</p>" + taulaAlumnes(expedients) +
        "<p>Matriculats a M02 (clausura)</p>" + taulaAlumnes(expedients.filter(filtreM02)) +
        "<p>NO matriculats a M03 (clausura)</p>" + taulaAlumnes(expedients.filter(filtreNoM03));
}
