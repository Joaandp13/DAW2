import { diccionari } from './Diccionari.js';
import { fill_array_random } from './Diccionari_array.js';

const Llista: string[] = fill_array_random(1000, diccionari);
const Llista2: string[] = fill_array_random(1000, diccionari);

function searchWord(array: string[], paraula: string): number {
    return array.indexOf(paraula);
}

function searchRandomWords(array: string[], aBuscar: string[]): string[] {
    const result: string[] = [];

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