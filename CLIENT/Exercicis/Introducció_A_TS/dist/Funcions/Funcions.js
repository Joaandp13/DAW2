import { exercici, obtenir } from "../comu/ui.js";
import { preuFinal, funcioAmbRetard, calcularMitjana, pi } from "./Basiques.js";
import { anagrames, paraulesAmb } from "./Paraules.js";
import { novaPartida, mostrarFrase, dirLletra, endevinar, completada, ajudaCompletar } from "./FraseOculta.js";
exercici("ex1", (out) => {
    out("preuFinal(100, 10, 21, true)   -> " + preuFinal(100, 10, 21, true));
    out("preuFinal(1000, 10, 21, false) -> " + preuFinal(1000, 10, 21, false));
    out("preuFinal(100, NaN, 21, true)  -> " + preuFinal(100, NaN, 21, true));
});
exercici("ex2", (out) => {
    const missatge = (m = "Hello world!") => out("[retard] " + m);
    out("Esperant 2 i 4 segons...");
    funcioAmbRetard(missatge, 2);
    funcioAmbRetard(missatge, 4, "Missatge personalitzat");
});
exercici("ex3", (out) => {
    const nums = obtenir("nums-mitjana").value.split(/[\s,;]+/).filter(Boolean);
    out(`Mitjana de [${nums.join(", ")}] = ${calcularMitjana(...nums)}`);
    out("Mitjana(4, 8, 'x', 6) = " + calcularMitjana(4, 8, "x", 6));
});
exercici("ex4", (out) => {
    const n = parseInt(obtenir("decimals-pi").value, 10);
    out(pi(Number.isNaN(n) ? 100 : n));
});
let joc = novaPartida();
const pintar = (missatge = "") => {
    obtenir("frase-oculta").textContent = mostrarFrase(joc);
    obtenir("lletres-dites").textContent = [...joc.dites].sort().join(" ") || "(cap)";
    obtenir("missatge-joc").textContent = missatge;
};
const finalitzar = () => {
    if (completada(joc)) {
        pintar(`Has completat la frase: ${joc.frase}`);
        return true;
    }
    const ajuda = ajudaCompletar(joc);
    if (!ajuda)
        return false;
    joc.endevinada = true;
    pintar(`L'ordinador n'està segur i guanya! Era: ${ajuda}`);
    return true;
};
obtenir("btn-lletra").addEventListener("click", () => {
    const camp = obtenir("lletra");
    try {
        const n = dirLletra(joc, camp.value);
        camp.value = "";
        if (!finalitzar())
            pintar(n ? `Hi ha ${n} vegada(es) la lletra` : "Aquesta lletra no hi és");
    }
    catch (e) {
        pintar(e instanceof Error ? e.message : String(e));
    }
});
obtenir("btn-intent").addEventListener("click", () => {
    const camp = obtenir("intent");
    pintar(endevinar(joc, camp.value) ? "Has guanyat! Has encertat la frase" : "No és aquesta frase");
});
obtenir("btn-nova").addEventListener("click", () => { joc = novaPartida(); pintar("Nova partida"); });
pintar();
exercici("ex6", (out) => {
    const w = obtenir("paraula-anagrama").value;
    const r = anagrames(w);
    out(r.length ? `Anagrames de ${w.toUpperCase()}:\n${r.join("\n")}` : "No s'ha trobat cap anagrama per aquesta paraula.");
});
exercici("ex7", (out) => {
    const l = obtenir("lletres-concurs").value;
    const r = paraulesAmb(l);
    out(r.length ? r.join("\n") : "No s'ha trobat cap paraula.");
});
//# sourceMappingURL=Funcions.js.map