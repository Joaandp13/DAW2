import { crearExpedients, taulaAlumnes, ordenarAlumnes, MODULS_CICLE } from "../Objectes/Expedients.js";
import { getObjectsByValue } from "../Objectes/Cerca.js";
export const totesAprovades = function (m) {
    return !m.notes.some(function (n) { return n < 5; });
};
export const sumarNotes = function (notes) {
    return notes.reduce(function (total, n) { return total + n; }, 0);
};
export const totsModulsAprovats = (a) => MODULS_CICLE.every((nom) => getObjectsByValue(a.moduls, "nom", nom)[0]?.notaModul !== undefined);
export const sumarNotesModuls = (a) => a.moduls.reduce((t, m) => t + (m.notaModul ?? 0), 0);
export function filtrarModul(nomModul, matriculat) {
    return (alumne) => (getObjectsByValue(alumne.moduls, "nom", nomModul).length > 0) === matriculat;
}
export function calcularFuncional(expedients) {
    for (const a of expedients) {
        for (const m of a.moduls) {
            if (totesAprovades(m))
                m.notaModul = sumarNotes(m.notes) / m.notes.length;
        }
        if (totsModulsAprovats(a))
            a.notaFinal = sumarNotesModuls(a) / a.moduls.length;
    }
}
export function demoExpedients() {
    const expedients = crearExpedients();
    calcularFuncional(expedients);
    expedients.sort(ordenarAlumnes);
    const filtreM02 = filtrarModul("M02", true);
    const filtreNoM03 = filtrarModul("M03", false);
    return "<p>Tots</p>" + taulaAlumnes(expedients) +
        "<p>Matriculats a M02 (clausura)</p>" + taulaAlumnes(expedients.filter(filtreM02)) +
        "<p>NO matriculats a M03 (clausura)</p>" + taulaAlumnes(expedients.filter(filtreNoM03));
}
//# sourceMappingURL=ExpedientsFuncional.js.map