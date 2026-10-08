export function preuFinal(preuBase, tpcDte, tpcIva, num) {
    if ([preuBase, tpcDte, tpcIva].some((v) => typeof v !== "number" || Number.isNaN(v)))
        return undefined;
    const sensePreuIva = preuBase - (preuBase * tpcDte) / 100;
    const preu = sensePreuIva + (sensePreuIva * tpcIva) / 100;
    if (num)
        return preu;
    return preu.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}
export function funcioAmbRetard(funcio, segons, ...args) {
    setTimeout(funcio, segons * 1000, ...args);
}
export function calcularMitjana(...valors) {
    const nums = valors.map((v) => (typeof v === "number" ? v : parseFloat(v))).filter((n) => !Number.isNaN(n));
    return nums.length === 0 ? 0 : nums.reduce((t, n) => t + n, 0) / nums.length;
}
function arctanInvers(d, digits) {
    let total = 10n ** digits / d;
    let terme = total;
    let n = 0n;
    while (terme !== 0n) {
        n += 1n;
        terme /= -(d * d);
        total += terme / (2n * n + 1n);
    }
    return total;
}
export function pi(decimals = 100) {
    if (!Number.isInteger(decimals) || decimals < 1)
        throw new RangeError("decimals ha de ser un enter >= 1");
    const guarda = 10n;
    const digits = BigInt(decimals) + guarda;
    let valor = 4n * (4n * arctanInvers(5n, digits) - arctanInvers(239n, digits));
    valor /= 10n ** guarda;
    const text = valor.toString();
    return text[0] + "." + text.slice(1);
}
//# sourceMappingURL=Basiques.js.map