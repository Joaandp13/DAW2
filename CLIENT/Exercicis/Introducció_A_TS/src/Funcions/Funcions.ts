// Punt d'entrada de Funcions.html
import { exercici, obtenir } from "../comu/ui.js";
import { preuFinal, funcioAmbRetard, calcularMitjana, pi } from "./Basiques.js";
import { anagrames, paraulesAmb } from "./Paraules.js";
import { novaPartida, mostrarFrase, dirLletra, endevinar, completada, ajudaCompletar } from "./FraseOculta.js";
import type { EstatJoc } from "./FraseOculta.js";

// ex.1
exercici("ex1", (out) => {
    out("preuFinal(100, 10, 21, true)   -> " + preuFinal(100, 10, 21, true));
    out("preuFinal(1000, 10, 21, false) -> " + preuFinal(1000, 10, 21, false));
    out("preuFinal(100, NaN, 21, true)  -> " + preuFinal(100, NaN, 21, true));
});

// ex.2 (el missatge s'escriu a la sortida en lloc d'un alert)
exercici("ex2", (out) => {
    const missatge = (m = "Hello world!") => out("[retard] " + m);
    out("Esperant 2 i 4 segons...");
    funcioAmbRetard(missatge, 2);
    funcioAmbRetard(missatge, 4, "Missatge personalitzat");
});

// ex.3
exercici("ex3", (out) => {
    const nums = obtenir<HTMLInputElement>("nums-mitjana").value.split(/[\s,;]+/).filter(Boolean);
    out(`Mitjana de [${nums.join(", ")}] = ${calcularMitjana(...nums)}`);
    out("Mitjana(4, 8, 'x', 6) = " + calcularMitjana(4, 8, "x", 6));
});

// ex.4
exercici("ex4", (out) => {
    const n = parseInt(obtenir<HTMLInputElement>("decimals-pi").value, 10);
    out(pi(Number.isNaN(n) ? 100 : n));
});

// ex.5 - Frase oculta
let joc: EstatJoc = novaPartida();
const pintar = (missatge = ""): void => {
    obtenir("frase-oculta").textContent = mostrarFrase(joc);
    obtenir("lletres-dites").textContent = [...joc.dites].sort().join(" ") || "(cap)";
    obtenir("missatge-joc").textContent = missatge;
};
const finalitzar = (): boolean => {
    if (completada(joc)) { pintar(`Has completat la frase: ${joc.frase}`); return true; }
    const ajuda = ajudaCompletar(joc);       // només retorna text si n'està completament segur
    if (!ajuda) return false;
    joc.endevinada = true;
    pintar(`L'ordinador n'està segur i guanya! Era: ${ajuda}`);
    return true;
};
obtenir("btn-lletra").addEventListener("click", () => {
    const camp = obtenir<HTMLInputElement>("lletra");
    try {
        const n = dirLletra(joc, camp.value);
        camp.value = "";
        if (!finalitzar()) pintar(n ? `Hi ha ${n} vegada(es) la lletra` : "Aquesta lletra no hi és");
    } catch (e) {
        pintar(e instanceof Error ? e.message : String(e));
    }
});
obtenir("btn-intent").addEventListener("click", () => {
    const camp = obtenir<HTMLInputElement>("intent");
    pintar(endevinar(joc, camp.value) ? "Has guanyat! Has encertat la frase" : "No és aquesta frase");
});
obtenir("btn-nova").addEventListener("click", () => { joc = novaPartida(); pintar("Nova partida"); });
pintar();

// ex.6
exercici("ex6", (out) => {
    const w = obtenir<HTMLInputElement>("paraula-anagrama").value;
    const r = anagrames(w);
    out(r.length ? `Anagrames de ${w.toUpperCase()}:\n${r.join("\n")}` : "No s'ha trobat cap anagrama per aquesta paraula.");
});

// ex.7
exercici("ex7", (out) => {
    const l = obtenir<HTMLInputElement>("lletres-concurs").value;
    const r = paraulesAmb(l);
    out(r.length ? r.join("\n") : "No s'ha trobat cap paraula.");
});
