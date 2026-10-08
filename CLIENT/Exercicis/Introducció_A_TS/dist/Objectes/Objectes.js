import { exercici, exerciciHtml, obtenir } from "../comu/ui.js";
import { getObjectByValue, getObjectsByValue, getObjectsByPattern, getObjectsInRange } from "./Cerca.js";
import { clients, taulaClients, supermercat, etiquetes } from "./Botiga.js";
import { crearExpedients, calcularMitjanes, ordenarAlumnes, taulaAlumnes, matriculatsEn, noMatriculatsEn, graduats } from "./Expedients.js";
import { escenaris, programaCotxe } from "./Cotxe.js";
import { crearDomotica } from "./Domotica.js";
exercici("ex1", (out) => {
    out("getObjectByValue(codi = 'ST'): " + JSON.stringify(getObjectByValue(supermercat, "codi", "ST")));
    out("getObjectsByValue(pes = 200): " + getObjectsByValue(supermercat, "pes", 200).map((a) => a.codi).join(", "));
    out("getObjectsByPattern(descripcio ~ 'S?c de*'): " + getObjectsByPattern(supermercat, "descripcio", "S?c de*").map((a) => a.descripcio).join(" | "));
    out("getObjectsInRange(preu 6..10): " + getObjectsInRange(supermercat, "preu", 6, 10).map((a) => `${a.codi} (${a.preu})`).join(", "));
});
exerciciHtml("ex2", () => taulaClients(clients));
exercici("ex3", (out) => out(etiquetes(supermercat)));
exercici("ex3b", (out) => out("Articles amb volum = 1.5:\n\n" + etiquetes(getObjectsByValue(supermercat, "volum", 1.5))));
exercici("ex3c", (out) => out("Articles amb preu entre 6 i 10:\n\n" + etiquetes(getObjectsInRange(supermercat, "preu", 6, 10))));
exercici("ex3d", (out) => out("Descripció que encaixa amb 'S?c de*':\n\n" + etiquetes(getObjectsByPattern(supermercat, "descripcio", "S?c de*"))));
const expedients = crearExpedients();
calcularMitjanes(expedients);
expedients.sort(ordenarAlumnes);
exerciciHtml("ex4", () => taulaAlumnes(expedients));
exerciciHtml("ex4a", () => "<p>Matriculats a M02</p>" + taulaAlumnes(matriculatsEn(expedients, "M02")));
exerciciHtml("ex4b", () => "<p>NO matriculats a M02</p>" + taulaAlumnes(noMatriculatsEn(expedients, "M02")));
exerciciHtml("ex4c", () => "<p>Han finalitzat el cicle</p>" + taulaAlumnes(graduats(expedients)));
exercici("ex5", (out) => {
    for (const e of escenaris) {
        out(`== ${e.nom} ==`);
        for (const accio of programaCotxe(e.sensors))
            out("  - " + accio);
    }
});
const missatges = obtenir("missatgeD");
const casa = crearDomotica((m) => { missatges.value = m + "\n" + missatges.value; });
let temporitzador;
obtenir("pluja").addEventListener("change", (e) => { casa.buscarSensor("pluja").valor = e.target.checked; });
obtenir("termometre").addEventListener("change", (e) => { casa.buscarSensor("termometre").valor = parseFloat(e.target.value); });
for (let i = 0; i < 3; ++i) {
    obtenir("presencia" + i).addEventListener("change", (e) => { casa.buscarSensor("presencia").valor[i] = e.target.checked; });
}
obtenir("btn-ex6").addEventListener("click", () => {
    if (temporitzador === undefined) {
        temporitzador = window.setInterval(casa.programa, 1000);
        obtenir("btn-ex6").textContent = "Aturar la casa";
    }
    else {
        clearInterval(temporitzador);
        temporitzador = undefined;
        obtenir("btn-ex6").textContent = "Engegar la casa";
    }
});
//# sourceMappingURL=Objectes.js.map