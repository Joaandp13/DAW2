function llegir(obj, atribut) {
    return atribut in obj ? obj[atribut] : undefined;
}
export function getObjectByValue(array, atribut, valor) {
    return array.find((obj) => atribut in obj && llegir(obj, atribut) === valor);
}
export function getObjectsByValue(array, atribut, valor) {
    return array.filter((obj) => atribut in obj && llegir(obj, atribut) === valor);
}
export function getObjectsByPattern(array, atribut, patro) {
    const escapat = patro.replace(/[.+^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapat.replaceAll("?", ".").replaceAll("*", ".*"), "i");
    return array.filter((obj) => {
        const v = llegir(obj, atribut);
        return typeof v === "string" && regex.test(v);
    });
}
export function getObjectsInRange(array, atribut, valorMin, valorMax) {
    return array.filter((obj) => {
        const v = llegir(obj, atribut);
        return typeof v === "number" && v >= valorMin && v <= valorMax;
    });
}
//# sourceMappingURL=Cerca.js.map