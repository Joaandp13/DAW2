import { diccio } from "./Diccionari.js";
import { cronometrar } from "../comu/ui.js";
const MAX_LINIES = 15;
export function crearArrayParaules(n) {
    if (!Number.isInteger(n) || n <= 0)
        throw new RangeError("n ha de ser un enter positiu");
    const dic = diccio.diccionari;
    const resultat = [];
    for (let i = 0; i < n; ++i) {
        resultat.push(dic[Math.floor(Math.random() * dic.length)]);
    }
    return resultat;
}
export function ex1(out) {
    out(crearArrayParaules(10).join("\n----------\n"));
}
export function eliminarRepetides(paraules, out) {
    let repetides = 0;
    for (let i = 0; i < paraules.length - 1; ++i) {
        let ndx;
        while ((ndx = paraules.indexOf(paraules[i], i + 1)) >= 0) {
            if (repetides < MAX_LINIES)
                out?.(`${paraules[i]} repetida a la posició ${ndx}`);
            paraules.splice(ndx, 1);
            ++repetides;
        }
    }
    return repetides;
}
export function ex2(out) {
    const paraules = crearArrayParaules(1000);
    let repetides = 0;
    const ms = cronometrar(() => { repetides = eliminarRepetides(paraules, out); });
    out(`... (només es mostren les ${MAX_LINIES} primeres)`);
    out(`S'han trobat ${repetides} paraules repetides`);
    out(`Ara l'array conté ${paraules.length} paraules diferents`);
    out(`Temps: ${ms.toFixed(3)} ms`);
}
export function eliminarRepetidesOrdenat(paraules, out) {
    if (paraules.length === 0)
        return 0;
    paraules.sort();
    let repetides = 0;
    let escriure = 1;
    for (let llegir = 1; llegir < paraules.length; ++llegir) {
        if (paraules[llegir] !== paraules[escriure - 1]) {
            paraules[escriure++] = paraules[llegir];
        }
        else {
            if (repetides < MAX_LINIES)
                out?.(`${paraules[llegir]} repetida (posició original ${llegir})`);
            ++repetides;
        }
    }
    paraules.length = escriure;
    return repetides;
}
export function ex3(out) {
    const paraules = crearArrayParaules(1000);
    let repetides = 0;
    const ms = cronometrar(() => { repetides = eliminarRepetidesOrdenat(paraules, out); });
    out(`... (només es mostren les ${MAX_LINIES} primeres)`);
    out(`S'han trobat ${repetides} paraules repetides`);
    out(`Ara l'array conté ${paraules.length} paraules diferents`);
    out(`Temps: ${ms.toFixed(3)} ms`);
}
export function buscarLineal(array, text) {
    return array.indexOf(text);
}
export function ex4(out) {
    const N = 1000;
    const paraules = crearArrayParaules(N);
    const dic = diccio.diccionari;
    let trobades = 0;
    const ms = cronometrar(() => {
        for (let i = 0; i < N; ++i) {
            const w = dic[Math.floor(Math.random() * dic.length)];
            const ndx = buscarLineal(paraules, w);
            if (ndx >= 0) {
                if (trobades < MAX_LINIES)
                    out(`${w} ${ndx}`);
                ++trobades;
            }
        }
    });
    out(`Trobades: ${trobades} de ${N} · Temps: ${ms.toFixed(3)} ms`);
}
export function buscarBinari(array, text) {
    let min = 0;
    let max = array.length - 1;
    while (min <= max) {
        const mid = Math.floor((min + max) / 2);
        if (array[mid] < text)
            min = mid + 1;
        else if (array[mid] > text)
            max = mid - 1;
        else
            return mid;
    }
    return -1;
}
export function ex5(out) {
    const N = 1000;
    const paraules = crearArrayParaules(N).sort();
    const dic = diccio.diccionari;
    let trobades = 0;
    const ms = cronometrar(() => {
        for (let i = 0; i < N; ++i) {
            const w = dic[Math.floor(Math.random() * dic.length)];
            const ndx = buscarBinari(paraules, w);
            if (ndx >= 0) {
                if (trobades < MAX_LINIES)
                    out(`${w} ${ndx}`);
                ++trobades;
            }
        }
    });
    out(`Trobades: ${trobades} de ${N} · Temps: ${ms.toFixed(3)} ms`);
}
export function ordenarLenInv(a, b) {
    if (a.length !== b.length)
        return a.length - b.length;
    return a < b ? 1 : a > b ? -1 : 0;
}
export function ex6(out) {
    const paraules = crearArrayParaules(1000).sort(ordenarLenInv);
    out(paraules.slice(0, 40).join("\n"));
    out("... (només les 40 primeres de 1000)");
}
export function cercarPerPatro(patro) {
    const p = patro.toUpperCase();
    if (!/^[A-ZÑ?*]+$/.test(p))
        throw new Error("El patró només pot contenir lletres, ? i *");
    const regex = new RegExp("^" + p.replaceAll("?", ".").replaceAll("*", ".*") + "$");
    return diccio.diccionari.filter((w) => regex.test(w));
}
//# sourceMappingURL=Paraules.js.map