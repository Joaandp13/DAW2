import { diccio } from "../Llistes/Diccionari.js";
import { transformar } from "../comu/text.js";
export const FRASES = [
    "A CABALLO REGALADO NO LE MIRES EL DIENTE",
    "MAS VALE PAJARO EN MANO QUE CIENTO VOLANDO",
    "NO HAY MAL QUE POR BIEN NO VENGA",
    "AL MAL TIEMPO BUENA CARA",
    "QUIEN BUSCA ENCUENTRA",
    "EN BOCA CERRADA NO ENTRAN MOSCAS",
    "OJOS QUE NO VEN CORAZON QUE NO SIENTE",
];
export function frasesValides(frases = FRASES) {
    const dic = new Set(diccio.diccionari);
    return frases.filter((f) => f.split(" ").every((p) => dic.has(p)));
}
export function novaPartida(frases = frasesValides()) {
    if (frases.length === 0)
        throw new Error("Cap frase té totes les paraules al diccionari");
    return { frase: frases[Math.floor(Math.random() * frases.length)], dites: new Set(), endevinada: false };
}
export function mostrarFrase(e) {
    return [...e.frase].map((c) => (c === " " ? "_" : e.endevinada || e.dites.has(c) ? c : "?")).join("");
}
export function dirLletra(e, lletra) {
    const l = transformar(lletra.trim());
    if (!/^[A-ZÑ]$/.test(l))
        throw new Error("Escriu una sola lletra");
    e.dites.add(l);
    return [...e.frase].filter((c) => c === l).length;
}
export function endevinar(e, intent) {
    const ok = transformar(intent).replace(/\s+/g, " ").trim() === e.frase;
    if (ok)
        e.endevinada = true;
    return ok;
}
export function completada(e) {
    return e.endevinada || [...e.frase].every((c) => c === " " || e.dites.has(c));
}
function encaixa(paraula, patro, dites) {
    if (paraula.length !== patro.length)
        return false;
    for (let i = 0; i < patro.length; ++i) {
        if (patro[i] === "?" ? dites.has(paraula[i]) : paraula[i] !== patro[i])
            return false;
    }
    return true;
}
export function ajudaCompletar(e) {
    const trobades = [];
    for (const patro of mostrarFrase(e).split("_")) {
        const candidates = diccio.diccionari.filter((p) => encaixa(p, patro, e.dites));
        if (candidates.length !== 1)
            return null;
        trobades.push(candidates[0]);
    }
    return trobades.join(" ");
}
//# sourceMappingURL=FraseOculta.js.map