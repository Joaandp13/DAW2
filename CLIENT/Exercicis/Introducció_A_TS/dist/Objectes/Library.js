export function getObjectByValue(array, atribut, valor) {
    return array.find((obj) => obj[atribut] === valor);
}
export function getObjectsByValue(array, atribut, valor) {
    return array.filter((obj) => obj[atribut] === valor);
}
export function getObjectsByPattern(array, atribut, patro) {
    const escapat = patro.replace(/[.+^${}()|[\]\\]/g, "\\$&");
    const regexText = escapat.replace(/\?/g, ".").replace(/\*/g, ".*");
    const regex = new RegExp(`^${regexText}$`);
    return array.filter((obj) => {
        const valor = obj[atribut];
        return typeof valor === "string" && regex.test(valor);
    });
}
export function getObjectsInRange(array, atribut, valorMin, valorMax) {
    return array.filter((obj) => {
        const valor = obj[atribut];
        return typeof valor === "number" && valor >= valorMin && valor <= valorMax;
    });
}
const persones = [
    { nom: "Anna", edat: 25, ciutat: "Barcelona" },
    { nom: "Arnau", edat: 32, ciutat: "Girona" },
    { nom: "Marta", edat: 41, ciutat: "Barcelona" },
    { nom: "Pau", edat: 19, ciutat: "Lleida" },
];
console.log(getObjectByValue(persones, "ciutat", "Barcelona"));
console.log(getObjectsByValue(persones, "ciutat", "Barcelona"));
console.log(getObjectsByPattern(persones, "nom", "A*"));
console.log(getObjectsByPattern(persones, "nom", "?au"));
console.log(getObjectsInRange(persones, "edat", 20, 35));
//# sourceMappingURL=Library.js.map