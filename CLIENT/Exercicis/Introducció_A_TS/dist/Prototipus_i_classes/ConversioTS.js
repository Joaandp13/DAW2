import { exercici, obtenir } from "../comu/ui.js";
export const PVP = function (preu, liquidar = false) {
    const p = Math.round(preu * 100);
    const memoria = liquidar ? PVP.cacheLiquidar : PVP.cache;
    if (!memoria[p]) {
        const base = liquidar ? preu - (preu * 40) / 100 : preu;
        memoria[p] = (base + (base * 21) / 100).toFixed(2) + " €";
    }
    return memoria[p];
};
PVP.cache = [];
PVP.cacheLiquidar = [];
export const articles = [
    { nom: "Collaret de perles", tipus: "bijuteria", passadis: "Passadís 1", bloc: "Bloc A", prestatge: 2 },
    { nom: "Anell de plata", tipus: "bijuteria", passadis: "Passadís 1", bloc: "Bloc B", prestatge: 1 },
    { nom: "Llimes d'ungles", tipus: "obrellaunes", passadis: "Passadís 2", bloc: "Bloc A", prestatge: 3 },
    { nom: "Esmalt vermell", tipus: "obrellaunes", passadis: "Passadís 2", bloc: "Bloc C", prestatge: 1 },
    { nom: "Gel de bany", tipus: "bany", passadis: "Passadís 3", bloc: "Bloc A", prestatge: 4 },
    { nom: "Esponja", tipus: "bany", passadis: "Passadís 3", bloc: "Bloc B", prestatge: 2 },
    { nom: "Lleixiu", tipus: "neteja", passadis: "Passadís 4", bloc: "Bloc D", prestatge: 1 },
];
export const crearFiltre = (tipus, nom) => () => {
    const situacio = [];
    for (const a of articles) {
        if (a.tipus === tipus && (!nom || a.nom === nom)) {
            situacio.push(`${a.nom}: ${a.passadis} ${a.bloc} - ${a.prestatge} prestatge`);
        }
    }
    return situacio.length === 0 ? "No he trobat res d'això" : situacio;
};
const filtreBijuteria = crearFiltre("bijuteria");
const filtreObrellaunes = crearFiltre("obrellaunes");
const filtreBany = crearFiltre("bany");
const filtreNeteja = crearFiltre("neteja");
function filtrar(filtre, out) {
    const s = filtre();
    out(typeof s === "string" ? s : s.join("\n"));
}
export const monitor = {
    constants: { temperatura: 36, pulsacions: 60, oxigen: 95, aturada: false },
    registre: [],
    escanejar() {
        const llegir = (id) => parseFloat(obtenir(id).value);
        const c = monitor.constants;
        c.temperatura = llegir("temperatura");
        c.pulsacions = llegir("pulsacions");
        c.oxigen = llegir("oxigen");
        c.aturada = obtenir("aturada").checked;
        monitor.registre.push({ ...c });
    },
};
exercici("ex1a", (out) => {
    for (const preu of [10, 19.99, 100])
        out(`PVP(${preu}) = ${PVP(preu)}   ·   liquidació: ${PVP(preu, true)}`);
    out(`Preus guardats a la caché: ${PVP.cache.filter(Boolean).length} normals, ${PVP.cacheLiquidar.filter(Boolean).length} de liquidació`);
});
for (const [id, filtre] of [["bijuteria", filtreBijuteria], ["obrellaunes", filtreObrellaunes], ["bany", filtreBany], ["neteja", filtreNeteja]]) {
    exercici("f-" + id, (out) => filtrar(filtre, out));
}
exercici("f-cap", (out) => filtrar(crearFiltre("bijuteria", "Anell d'or"), out));
obtenir("btn-escanejar").addEventListener("click", () => {
    monitor.escanejar();
    obtenir("out-monitor").textContent = monitor.registre.map((d, i) => `#${i + 1} ${JSON.stringify(d)}`).join("\n");
});
//# sourceMappingURL=ConversioTS.js.map