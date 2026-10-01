import { diccionari } from './Diccionari.js';
export function fill_array_random(num, array) {
    let a = [];
    for (let i = 0; i < num; ++i) {
        a.push(diccionari[Math.floor(Math.random() * diccionari.length)]);
    }
    return a;
}
//# sourceMappingURL=Diccionari_array.js.map