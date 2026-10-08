// Punt d'entrada de Objectes.html
import { exercici, exerciciHtml, obtenir } from "../comu/ui.js";
import { getObjectByValue, getObjectsByValue, getObjectsByPattern, getObjectsInRange } from "./Cerca.js";
import { clients, taulaClients, supermercat, etiquetes } from "./Botiga.js";
import { crearExpedients, calcularMitjanes, ordenarAlumnes, taulaAlumnes, matriculatsEn, noMatriculatsEn, graduats } from "./Expedients.js";
import { escenaris, programaCotxe } from "./Cotxe.js";
import { crearDomotica } from "./Domotica.js";

// ex.1 - Mètodes de cerca genèrics (es proven amb els articles del supermercat)
exercici("ex1", (out) => {
    out("getObjectByValue(codi = 'ST'): " + JSON.stringify(getObjectByValue(supermercat, "codi", "ST")));
    out("getObjectsByValue(pes = 200): " + getObjectsByValue(supermercat, "pes", 200).map((a) => a.codi).join(", "));
    out("getObjectsByPattern(descripcio ~ 'S?c de*'): " + getObjectsByPattern(supermercat, "descripcio", "S?c de*").map((a) => a.descripcio).join(" | "));
    out("getObjectsInRange(preu 6..10): " + getObjectsInRange(supermercat, "preu", 6, 10).map((a) => `${a.codi} (${a.preu})`).join(", "));
});

// ex.2 - Clients
exerciciHtml("ex2", () => taulaClients(clients));

// ex.3 - Supermercat
exercici("ex3", (out) => out(etiquetes(supermercat)));
exercici("ex3b", (out) => out("Articles amb volum = 1.5:\n\n" + etiquetes(getObjectsByValue(supermercat, "volum", 1.5))));
exercici("ex3c", (out) => out("Articles amb preu entre 6 i 10:\n\n" + etiquetes(getObjectsInRange(supermercat, "preu", 6, 10))));
exercici("ex3d", (out) => out("Descripció que encaixa amb 'S?c de*':\n\n" + etiquetes(getObjectsByPattern(supermercat, "descripcio", "S?c de*"))));

// ex.4 - Expedients (es calculen i s'ordenen una sola vegada)
const expedients = crearExpedients();
calcularMitjanes(expedients);
expedients.sort(ordenarAlumnes);
exerciciHtml("ex4", () => taulaAlumnes(expedients));
exerciciHtml("ex4a", () => "<p>Matriculats a M02</p>" + taulaAlumnes(matriculatsEn(expedients, "M02")));
exerciciHtml("ex4b", () => "<p>NO matriculats a M02</p>" + taulaAlumnes(noMatriculatsEn(expedients, "M02")));
exerciciHtml("ex4c", () => "<p>Han finalitzat el cicle</p>" + taulaAlumnes(graduats(expedients)));

// ex.5 - Cotxe sense conductor
exercici("ex5", (out) => {
    for (const e of escenaris) {
        out(`== ${e.nom} ==`);
        for (const accio of programaCotxe(e.sensors)) out("  - " + accio);
    }
});

// ex.6 - Casa domòtica (interactiva)
const missatges = obtenir<HTMLTextAreaElement>("missatgeD");
const casa = crearDomotica((m) => { missatges.value = m + "\n" + missatges.value; });
let temporitzador: number | undefined;

obtenir("pluja").addEventListener("change", (e) => { casa.buscarSensor("pluja").valor = (e.target as HTMLInputElement).checked; });
obtenir("termometre").addEventListener("change", (e) => { casa.buscarSensor("termometre").valor = parseFloat((e.target as HTMLInputElement).value); });
for (let i = 0; i < 3; ++i) {
    obtenir("presencia" + i).addEventListener("change", (e) => { casa.buscarSensor("presencia").valor[i] = (e.target as HTMLInputElement).checked; });
}
obtenir("btn-ex6").addEventListener("click", () => {
    if (temporitzador === undefined) {
        temporitzador = window.setInterval(casa.programa, 1000);    // cada segon llegeix sensors
        obtenir("btn-ex6").textContent = "Aturar la casa";
    } else {
        clearInterval(temporitzador);
        temporitzador = undefined;
        obtenir("btn-ex6").textContent = "Engegar la casa";
    }
});
