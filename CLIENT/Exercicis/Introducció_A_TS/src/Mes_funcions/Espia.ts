// MÉS FUNCIONS (ex. 6): la calculadora de l'espia (encriptar / desencriptar amb caché)
import { transformar } from "../comu/text.js";

// AES ve de l'arxiu aes.js (script clàssic que es carrega a l'HTML). Només es declara el tipus.
declare const AES: { encrypt(w: string): string; decrypt(codi: string): string };

interface EntradaCache { codi: string; vegades: number; }

// Caché: paraula -> {codi, vegades que s'ha encriptat}
const cacheEncriptar = new Map<string, EntradaCache>();
// Caché: codi -> paraula
const cacheDesencriptar = new Map<string, string>();

/** Majúscules sense accents i només A-Z, Ñ, Ç, 0-9; retorna les paraules en un array. */
export function extreureParaules(frase: string): string[] {
    const neta = transformar(frase).replace(/[^A-Z0-9ÇÑ]+/g, " ").trim();
    return neta === "" ? [] : neta.split(" ");
}

function encriptarParaula(w: string): string {
    let entrada = cacheEncriptar.get(w);
    if (!entrada) {
        entrada = { codi: AES.encrypt(w), vegades: 0 };
        cacheEncriptar.set(w, entrada);
    }
    ++entrada.vegades;
    return entrada.codi;
}

function desencriptarParaula(codi: string): string {
    let paraula = cacheDesencriptar.get(codi);
    if (paraula === undefined) {
        paraula = AES.decrypt(codi);      // pot llençar una excepció si el codi no és vàlid
        cacheDesencriptar.set(codi, paraula);
    }
    return paraula;
}

export function encriptar(s: string): string {
    return extreureParaules(s).map(encriptarParaula).join(" ");
}

/** Desencripta les paraules; si una falla, ensenya l'error amb alert() i continua amb les altres. */
export function desencriptar(s: string): string {
    const resultat: string[] = [];
    for (const codi of s.trim().split(/\s+/).filter(Boolean)) {
        try {
            resultat.push(desencriptarParaula(codi));
        } catch (e) {
            alert(`Error desencriptant «${codi}»: ` + (e instanceof Error ? e.message : String(e)));
        }
    }
    return resultat.join(" ");
}

/** OPCIONAL: elimina de la caché les paraules encriptades 1 sola vegada i retorna el TOP 10 (PARAULA (N)). */
export function neteja(): string {
    for (const [paraula, entrada] of cacheEncriptar) {
        if (entrada.vegades === 1) cacheEncriptar.delete(paraula);
    }
    return [...cacheEncriptar]
        .sort((a, b) => b[1].vegades - a[1].vegades)
        .slice(0, 10)
        .map(([paraula, entrada]) => `${paraula} (${entrada.vegades})`)
        .join("\n");
}

/** Compara el temps d'encriptar la mateixa frase moltes vegades amb i sense caché. */
export function compararTemps(frase: string, repeticions = 5000): { senseCache: number; ambCache: number } {
    const paraules = extreureParaules(frase);

    const t0 = performance.now();
    for (let i = 0; i < repeticions; ++i) paraules.forEach((w) => AES.encrypt(w));
    const senseCache = performance.now() - t0;

    const local = new Map<string, string>();
    const t1 = performance.now();
    for (let i = 0; i < repeticions; ++i) {
        paraules.forEach((w) => { if (!local.has(w)) local.set(w, AES.encrypt(w)); });
    }
    const ambCache = performance.now() - t1;

    return { senseCache, ambCache };
}
