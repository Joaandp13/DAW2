export function crearRegistre(out) {
    return {
        ex1: () => out("Executant ex1"),
        ex2: () => out("Executant ex2"),
        ex3: () => out("Executant ex3"),
        ex4: () => out("Executant ex4"),
        calcularMitjana,
    };
}
export function calcularMitjana(notes) {
    const valides = notes.filter((n) => !Number.isNaN(n));
    return valides.length === 0 ? 0 : valides.reduce((t, n) => t + n, 0) / valides.length;
}
export function executarNom(out) {
    const registre = crearRegistre(out);
    for (let i = 1; i <= 4; ++i) {
        const nom = "ex" + i;
        registre[nom]();
        registre[nom].call(null);
    }
}
export function executarParamVars(out) {
    const registre = crearRegistre(out);
    let total = 0;
    for (let i = 0; i < 10; ++i) {
        const quantes = Math.floor(Math.random() * 4) + 3;
        const notes = Array.from({ length: quantes }, () => Math.floor(Math.random() * 10) + 1);
        const mitjana = registre["calcularMitjana"](notes);
        out(`${notes.join(", ")} : ${mitjana.toFixed(1)}`);
        total += mitjana;
    }
    out("Mitjana final: " + (total / 10).toFixed(2));
}
//# sourceMappingURL=Executar.js.map