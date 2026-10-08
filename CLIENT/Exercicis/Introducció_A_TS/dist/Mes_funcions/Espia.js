import { transformar } from "../comu/text.js";
const cacheEncriptar = new Map();
const cacheDesencriptar = new Map();
export function extreureParaules(frase) {
    const neta = transformar(frase).replace(/[^A-Z0-9ÇÑ]+/g, " ").trim();
    return neta === "" ? [] : neta.split(" ");
}
function encriptarParaula(w) {
    let entrada = cacheEncriptar.get(w);
    if (!entrada) {
        entrada = { codi: AES.encrypt(w), vegades: 0 };
        cacheEncriptar.set(w, entrada);
    }
    ++entrada.vegades;
    return entrada.codi;
}
function desencriptarParaula(codi) {
    let paraula = cacheDesencriptar.get(codi);
    if (paraula === undefined) {
        paraula = AES.decrypt(codi);
        cacheDesencriptar.set(codi, paraula);
    }
    return paraula;
}
export function encriptar(s) {
    return extreureParaules(s).map(encriptarParaula).join(" ");
}
export function desencriptar(s) {
    const resultat = [];
    for (const codi of s.trim().split(/\s+/).filter(Boolean)) {
        try {
            resultat.push(desencriptarParaula(codi));
        }
        catch (e) {
            alert(`Error desencriptant «${codi}»: ` + (e instanceof Error ? e.message : String(e)));
        }
    }
    return resultat.join(" ");
}
export function neteja() {
    for (const [paraula, entrada] of cacheEncriptar) {
        if (entrada.vegades === 1)
            cacheEncriptar.delete(paraula);
    }
    return [...cacheEncriptar]
        .sort((a, b) => b[1].vegades - a[1].vegades)
        .slice(0, 10)
        .map(([paraula, entrada]) => `${paraula} (${entrada.vegades})`)
        .join("\n");
}
export function compararTemps(frase, repeticions = 5000) {
    const paraules = extreureParaules(frase);
    const t0 = performance.now();
    for (let i = 0; i < repeticions; ++i)
        paraules.forEach((w) => AES.encrypt(w));
    const senseCache = performance.now() - t0;
    const local = new Map();
    const t1 = performance.now();
    for (let i = 0; i < repeticions; ++i) {
        paraules.forEach((w) => { if (!local.has(w))
            local.set(w, AES.encrypt(w)); });
    }
    const ambCache = performance.now() - t1;
    return { senseCache, ambCache };
}
//# sourceMappingURL=Espia.js.map