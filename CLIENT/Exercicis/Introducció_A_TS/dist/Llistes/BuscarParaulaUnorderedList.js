import { diccionari } from './Diccionari.js';
import { fill_array_random } from './Diccionari_array.js';
const Llista = fill_array_random(1000, diccionari);
const Llista2 = fill_array_random(1000, diccionari);
function searchWord(array, paraula) {
    return array.indexOf(paraula);
}
function searchRandomWords(array, aBuscar) {
    const result = [];
    for (const paraula of aBuscar) {
        const pos = searchWord(array, paraula);
        if (pos !== -1) {
            result.push(`${paraula} posició: ${pos}`);
        }
    }
    return result;
}
const start = performance.now();
const trobades = searchRandomWords(Llista, Llista2);
const end = performance.now();
console.log(`Trobades: ${trobades.length} de ${Llista2.length}`);
console.log(trobades);
console.log(`Temps: ${(end - start).toFixed(2)} ms`);
//# sourceMappingURL=BuscarParaulaUnorderedList.js.map