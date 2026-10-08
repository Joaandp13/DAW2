// PROTOTIPUS I CLASSES - ex.1: pràctica 2.1 (funcions, objectes, llistes) convertida a TypeScript
import { exercici, obtenir } from "../comu/ui.js";
import type { Sortida } from "../comu/ui.js";

// ---------------------------------------------------------------
// Funció PVP: una funció que també té propietats (caché)
// ---------------------------------------------------------------
// Un "type" amb signatura de crida + propietats descriu una funció amb propietats afegides.
type PvpFunc = {
    (preu: number, liquidar?: boolean): string;
    cache: string[];
    cacheLiquidar: string[];
};

export const PVP = function (preu: number, liquidar = false): string {
    const p = Math.round(preu * 100);   // els cèntims serveixen com a clau de la caché
    const memoria = liquidar ? PVP.cacheLiquidar : PVP.cache;
    if (!memoria[p]) {
        const base = liquidar ? preu - (preu * 40) / 100 : preu;     // liquidació: -40 %
        memoria[p] = (base + (base * 21) / 100).toFixed(2) + " €";   // + 21 % d'IVA
    }
    return memoria[p];
} as PvpFunc;
PVP.cache = [];
PVP.cacheLiquidar = [];

// ---------------------------------------------------------------
// Filtres: funcions que retornen funcions (clausures)
// ---------------------------------------------------------------
interface ArticleMagatzem { nom: string; tipus: string; passadis: string; bloc: string; prestatge: number; }

export const articles: ArticleMagatzem[] = [
    { nom: "Collaret de perles", tipus: "bijuteria", passadis: "Passadís 1", bloc: "Bloc A", prestatge: 2 },
    { nom: "Anell de plata", tipus: "bijuteria", passadis: "Passadís 1", bloc: "Bloc B", prestatge: 1 },
    { nom: "Llimes d'ungles", tipus: "obrellaunes", passadis: "Passadís 2", bloc: "Bloc A", prestatge: 3 },
    { nom: "Esmalt vermell", tipus: "obrellaunes", passadis: "Passadís 2", bloc: "Bloc C", prestatge: 1 },
    { nom: "Gel de bany", tipus: "bany", passadis: "Passadís 3", bloc: "Bloc A", prestatge: 4 },
    { nom: "Esponja", tipus: "bany", passadis: "Passadís 3", bloc: "Bloc B", prestatge: 2 },
    { nom: "Lleixiu", tipus: "neteja", passadis: "Passadís 4", bloc: "Bloc D", prestatge: 1 },
];

type FiltreFunc = () => string | string[];
type CrearFiltreFunc = (tipus: string, nom?: string) => FiltreFunc;

export const crearFiltre: CrearFiltreFunc = (tipus, nom) => () => {
    const situacio: string[] = [];
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

function filtrar(filtre: FiltreFunc, out: Sortida): void {
    const s = filtre();
    out(typeof s === "string" ? s : s.join("\n"));    // "narrowing": typeof diferencia string de string[]
}

// ---------------------------------------------------------------
// Monitor: objecte amb un tipus ben definit
// ---------------------------------------------------------------
type Dades = { temperatura: number; pulsacions: number; oxigen: number; aturada: boolean };
type Monitor = { constants: Dades; registre: Dades[]; escanejar(): void };

export const monitor: Monitor = {
    constants: { temperatura: 36, pulsacions: 60, oxigen: 95, aturada: false },
    registre: [],
    escanejar() {
        const llegir = (id: string): number => parseFloat(obtenir<HTMLInputElement>(id).value);
        const c = monitor.constants;
        c.temperatura = llegir("temperatura");
        c.pulsacions = llegir("pulsacions");
        c.oxigen = llegir("oxigen");
        c.aturada = obtenir<HTMLInputElement>("aturada").checked;
        monitor.registre.push({ ...c });        // còpia de l'objecte (no la mateixa referència)
    },
};

// ---------------------------------------------------------------
// Connexió amb la pàgina
// ---------------------------------------------------------------
exercici("ex1a", (out) => {
    for (const preu of [10, 19.99, 100]) out(`PVP(${preu}) = ${PVP(preu)}   ·   liquidació: ${PVP(preu, true)}`);
    out(`Preus guardats a la caché: ${PVP.cache.filter(Boolean).length} normals, ${PVP.cacheLiquidar.filter(Boolean).length} de liquidació`);
});

for (const [id, filtre] of [["bijuteria", filtreBijuteria], ["obrellaunes", filtreObrellaunes], ["bany", filtreBany], ["neteja", filtreNeteja]] as const) {
    exercici("f-" + id, (out) => filtrar(filtre, out));
}
exercici("f-cap", (out) => filtrar(crearFiltre("bijuteria", "Anell d'or"), out));

obtenir("btn-escanejar").addEventListener("click", () => {
    monitor.escanejar();
    obtenir("out-monitor").textContent = monitor.registre.map((d, i) => `#${i + 1} ${JSON.stringify(d)}`).join("\n");
});
