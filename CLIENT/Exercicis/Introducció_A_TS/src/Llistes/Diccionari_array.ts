import { diccionari } from './Diccionari.js';

function fill_array_random(num: number, array:any[]) : any[]{
    let a :any[] = []

    for(let i=0; i<num; ++i){
        a.push(diccionari[Math.floor(Math.random()*diccionari.length)])
    }

    return a;
}

const text = document.getElementById('textbox')
function print_random_words(a : HTMLElement | null) : void {
    if(!a){
        return;
    }
    let userIN : string = prompt("Introdueix el número d'elements per l'array")?? "0";
    let array : any[] = fill_array_random(parseInt(userIN), diccionari)
    
    array.forEach(element => {
        a.innerHTML+="<br>"+element;
        });
}

function check_dupe(array: string[]): boolean {
    for (let i = 0; i < array.length; ++i) {
        const first = array.indexOf(array[i]);

        if (first !== i) {
            console.log(`Repetida: "${array[i]}" a la posició ${i} (primera aparició: ${first})`);
            array.splice(i, 1);
            return true;
        }
    }
    return false;
}


function remove_all_dupes(array: string[]): void {
    while (check_dupe(array)) {
        // keep going
    }
}

const words = fill_array_random(1000, diccionari);
console.log("Abans:", words.length);

const start = performance.now();
remove_all_dupes(words);
const end = performance.now();

console.log("Després:", words.length);
console.log(`Temps: ${(end - start).toFixed(2)} ms`);

print_random_words(text);