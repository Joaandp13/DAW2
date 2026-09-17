export function convertidor(valor, uni1, uni2) {
    const exponents = {
        "mm": -3, "cm": -2, "dm": -1, "m": 0, "Dm": 1, "Hm": 2, "Km": 3
    };
    const valorNum = parseFloat(valor);
    if (Number.isNaN(valorNum))
        return "";
    if (!(uni1 in exponents) || !(uni2 in exponents))
        return "";
    const resultat = valorNum * Math.pow(10, exponents[uni1] - exponents[uni2]);
    return resultat.toPrecision(4);
}
//# sourceMappingURL=functions.js.map