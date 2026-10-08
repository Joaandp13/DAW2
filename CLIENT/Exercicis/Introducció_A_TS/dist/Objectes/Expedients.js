import { escapeHtml } from "../comu/ui.js";
import { getObjectsByValue } from "./Cerca.js";
export const MODULS_CICLE = ["M02", "M03", "M06", "M07"];
export function crearExpedients() {
    const alumne1 = { nom: "Super", cognoms: "Woman", curs: 2, moduls: [
            { nom: "M03", notes: [7, 7, 7] }, { nom: "M06", notes: [5, 5] }, { nom: "M07", notes: [7, 7, 7] }
        ] };
    const alumne2 = { nom: "Spider", cognoms: "Man", curs: 2, moduls: [
            { nom: "M02", notes: [6, 6] }, { nom: "M03", notes: [6, 4, 4] }, { nom: "M06", notes: [8, 8] }, { nom: "M07", notes: [9, 9, 9] }
        ] };
    const alumne3 = { nom: "Cat", cognoms: "Woman", curs: 1, moduls: [
            { nom: "M02", notes: [9, 9] }, { nom: "M03", notes: [8, 8, 8] }
        ] };
    const alumne4 = structuredClone(alumne1);
    alumne4.nom = "Bat";
    alumne4.cognoms = "Man";
    alumne4.moduls = [{ nom: "M02", notes: [9, 9] }, { nom: "M03", notes: [7, 7, 7] }, { nom: "M06", notes: [5, 5] }, { nom: "M07", notes: [7, 7, 7] }];
    const alumne5 = structuredClone(alumne2);
    alumne5.nom = "Wonder";
    alumne5.cognoms = "Woman";
    alumne5.moduls = [{ nom: "M02", notes: [8, 8] }, { nom: "M03", notes: [6, 6, 6] }, { nom: "M06", notes: [7, 7] }, { nom: "M07", notes: [9, 9, 9] }];
    const alumne6 = structuredClone(alumne3);
    alumne6.nom = "Iron";
    alumne6.cognoms = "Man";
    alumne6.moduls[0].notes = [8, 4];
    alumne6.moduls.push({ nom: "M07", notes: [6, 6, 6] });
    return [alumne1, alumne2, alumne3, alumne4, alumne5, alumne6];
}
export function calcularMitjanes(expedients) {
    for (const a of expedients) {
        for (const m of a.moduls) {
            if (m.notes.every((n) => n >= 5)) {
                m.notaModul = m.notes.reduce((t, n) => t + n, 0) / m.notes.length;
            }
        }
        const tots = MODULS_CICLE.every((nom) => getObjectsByValue(a.moduls, "nom", nom)[0]?.notaModul !== undefined);
        if (tots)
            a.notaFinal = a.moduls.reduce((t, m) => t + (m.notaModul ?? 0), 0) / a.moduls.length;
    }
}
export function ordenarAlumnes(a1, a2) {
    return a1.cognoms.localeCompare(a2.cognoms) || a1.nom.localeCompare(a2.nom);
}
export function taulaAlumnes(llista) {
    let html = "<table><thead><tr><th>Alumne</th><th>Curs</th>";
    for (const m of MODULS_CICLE)
        html += `<th>${m}</th>`;
    html += "<th>Final</th></tr></thead><tbody>";
    for (const a of llista) {
        html += `<tr><td>${escapeHtml(a.cognoms + ", " + a.nom)}</td><td class="centre">${a.curs}</td>`;
        for (const nom of MODULS_CICLE) {
            const m = getObjectsByValue(a.moduls, "nom", nom)[0];
            html += `<td class="centre">${m?.notaModul !== undefined ? m.notaModul.toFixed(0) : "&nbsp;"}</td>`;
        }
        html += `<td class="centre">${a.notaFinal !== undefined ? "<strong>" + a.notaFinal.toFixed(1) + "</strong>" : "&nbsp;"}</td></tr>`;
    }
    return html + "</tbody></table>";
}
export const matriculatsEn = (llista, modul) => llista.filter((a) => getObjectsByValue(a.moduls, "nom", modul).length > 0);
export const noMatriculatsEn = (llista, modul) => llista.filter((a) => getObjectsByValue(a.moduls, "nom", modul).length === 0);
export const graduats = (llista) => llista.filter((a) => a.notaFinal !== undefined);
//# sourceMappingURL=Expedients.js.map