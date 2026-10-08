// MÉS FUNCIONS (ex. 1-2): executar funcions pel seu nom
import type { Sortida } from "../comu/ui.js";

// En JavaScript clàssic es feia window["ex1"](). En TypeScript/mòduls les funcions NO són globals,
// així que es guarden en un objecte "registre" i s'hi accedeix per clau (text).
type FuncioQualsevol = (...args: any[]) => unknown;

export function crearRegistre(out: Sortida): Record<string, FuncioQualsevol> {
    return {
        ex1: () => out("Executant ex1"),
        ex2: () => out("Executant ex2"),
        ex3: () => out("Executant ex3"),
        ex4: () => out("Executant ex4"),
        calcularMitjana,
    };
}

/** Mitjana de l'array de notes (rep l'array com a UN sol paràmetre). */
export function calcularMitjana(notes: number[]): number {
    const valides = notes.filter((n) => !Number.isNaN(n));
    return valides.length === 0 ? 0 : valides.reduce((t, n) => t + n, 0) / valides.length;
}

/** ex.1: bucle que crida ex1(), ex2()... construint el nom amb text. */
export function executarNom(out: Sortida): void {
    const registre = crearRegistre(out);
    for (let i = 1; i <= 4; ++i) {
        const nom = "ex" + i;
        registre[nom]();                    // crida directa pel nom
        registre[nom].call(null);           // equivalent amb call()
    }
}

/** ex.2: 10 vegades, array de 3-6 notes aleatòries (1-10) i crida a calcularMitjana pel nom. */
export function executarParamVars(out: Sortida): void {
    const registre = crearRegistre(out);
    let total = 0;
    for (let i = 0; i < 10; ++i) {
        const quantes = Math.floor(Math.random() * 4) + 3;                       // 3..6
        const notes = Array.from({ length: quantes }, () => Math.floor(Math.random() * 10) + 1);
        const mitjana = registre["calcularMitjana"](notes) as number;           // crida pel nom
        out(`${notes.join(", ")} : ${mitjana.toFixed(1)}`);
        total += mitjana;
    }
    out("Mitjana final: " + (total / 10).toFixed(2));
}
