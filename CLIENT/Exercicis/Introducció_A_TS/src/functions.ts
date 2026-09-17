export function convertidor(valor: string, uni1: string, uni2: string): string {
    const exponents: { [unitat: string]: number } = {
        "mm": -3, "cm": -2, "dm": -1, "m": 0, "Dm": 1, "Hm": 2, "Km": 3
    };

    const valorNum: number = parseFloat(valor);

    if (Number.isNaN(valorNum)) return "";
    if (!(uni1 in exponents) || !(uni2 in exponents)) return "";

    const resultat: number = valorNum * Math.pow(10, exponents[uni1] - exponents[uni2]);

    return resultat.toPrecision(4);
}