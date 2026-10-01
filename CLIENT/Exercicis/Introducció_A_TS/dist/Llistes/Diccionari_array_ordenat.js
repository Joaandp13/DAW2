import { fill_array_random } from './Diccionari_array.js';
import { diccionari } from './Diccionari.js';
let Diccionari = fill_array_random(10000, diccionari);
console.log("Abans:", Diccionari.length);
const start = performance.now();
Diccionari.sort();
let write = 1;
let repetides = 0;
for (let read = 1; read < Diccionari.length; read++) {
    if (Diccionari[read] !== Diccionari[write - 1]) {
        Diccionari[write] = Diccionari[read];
        write++;
    }
    else {
        repetides++;
    }
}
Diccionari.length = write;
const end = performance.now();
console.log("Després:", Diccionari.length);
console.log("Repetides eliminades:", repetides);
console.log(`Temps: ${(end - start).toFixed(2)} ms`);
//# sourceMappingURL=Diccionari_array_ordenat.js.map