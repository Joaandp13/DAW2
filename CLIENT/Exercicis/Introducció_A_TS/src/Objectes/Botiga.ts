// OBJECTES V2 - ex.2 (Clients) i ex.3 (Supermercat)
import { escapeHtml } from "../comu/ui.js";

// ---------------------------------------------------------------
// Clients
// ---------------------------------------------------------------
export interface Client {
    nif: string;
    nom: string;
    email: string;
    adresa: string;
    cp: string;
    telef: string;
}

export const clients: Client[] = [
    { nif: "45454545M", nom: "Ainhoa", email: "azaldua@sapalomera.cat", adresa: "Av. Pau, 123", cp: "17300", telef: "789.123.456" },
    { nif: "87654321A", nom: "Xavier", email: "xmartin@sapalomera.cat", adresa: "C. de Barcelona, 80, 1rA", cp: "17310", telef: "456.789.123" },
    { nif: "12345678Z", nom: "Pere", email: "psanchez@sapalomera.cat", adresa: "Pl. dels programadors, Ed. Java, àtic", cp: "17320", telef: "123.456.789" },
];

/** Taula HTML amb encapçalaments a partir d'un array de clients. */
export function taulaClients(llista: Client[]): string {
    const columnes: [keyof Client, string][] = [
        ["nif", "NIF"], ["nom", "Nom"], ["email", "E-mail"], ["adresa", "Adreça"], ["cp", "CP"], ["telef", "Telèfon"],
    ];
    let html = "<table><thead><tr>";
    for (const [, titol] of columnes) html += `<th>${titol}</th>`;
    html += "</tr></thead><tbody>";
    for (const c of llista) {
        html += "<tr>";
        for (const [clau] of columnes) html += `<td>${escapeHtml(c[clau])}</td>`;
        html += "</tr>";
    }
    return html + "</tbody></table>";
}

// ---------------------------------------------------------------
// Supermercat
// ---------------------------------------------------------------
export interface Article {
    codi: string;
    descripcio: string;
    preu: number;
    pes?: number;      // grams
    volum?: number;    // litres
    unitats?: number;
    dte?: number;      // descompte en %
}

export const supermercat: Article[] = [
    { codi: "P500", descripcio: "Puzzle 500 peces", preu: 8.5 },
    { codi: "T200", descripcio: "Torró d'Alacant", preu: 12.95, pes: 200 },
    { codi: "ST", descripcio: "Suc de taronja", preu: 1.95, volum: 1.5 },
    { codi: "PWC", descripcio: "Paper de Vàter", preu: 6.2, unitats: 6, dte: 10 },
    { codi: "SP2", descripcio: "Sac de patates", preu: 12.95, pes: 2000 },
];

const SUFIXOS: Record<string, string> = { pes: " g", volum: " l", dte: " %" };

const moneda = (n: number): string => n.toFixed(2).replace(".", ",") + " €";

/** Etiqueta de text d'un article, amb sufixos (g, l, %, €) i preu final si té descompte. */
export function etiqueta(a: Article): string {
    const linies: string[] = [];
    for (const [clau, valor] of Object.entries(a)) {
        if (clau === "preu") linies.push(`preu: ${moneda(valor as number)}`);
        else linies.push(`${clau}: ${valor}${SUFIXOS[clau] ?? ""}`);
    }
    if (a.dte) linies.push(`preuFinal: ${moneda(a.preu - (a.preu * a.dte) / 100)}`);
    return linies.join("\n");
}

export function etiquetes(llista: Article[]): string {
    return llista.length ? llista.map(etiqueta).join("\n\n") : "(cap article)";
}
