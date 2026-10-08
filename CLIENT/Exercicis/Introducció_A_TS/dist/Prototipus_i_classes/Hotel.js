import { Reserva } from "./Reserva.js";
import { escapeHtml } from "../comu/ui.js";
export class Hotel {
    static #properId = 0;
    #id;
    #nom;
    #poblacio;
    #habitacions;
    #habitacionsLliures;
    #reserves = [];
    constructor(nom, poblacio, habitacions) {
        if (!nom.trim())
            throw new Error("El nom de l'hotel no pot estar buit");
        if (!poblacio.trim())
            throw new Error("La població no pot estar buida");
        if (!Number.isInteger(habitacions) || habitacions <= 0)
            throw new RangeError("L'hotel ha de tenir més de 0 habitacions");
        this.#id = Hotel.#properId++;
        this.#nom = nom.trim();
        this.#poblacio = poblacio.trim();
        this.#habitacions = habitacions;
        this.#habitacionsLliures = habitacions;
    }
    get id() { return this.#id; }
    get nom() { return this.#nom; }
    get poblacio() { return this.#poblacio; }
    get habitacions() { return this.#habitacions; }
    get habitacionsLliures() { return this.#habitacionsLliures; }
    reservar(nif, places, individuals) {
        if (!Number.isInteger(places) || places < 0)
            throw new RangeError("Les places han de ser un número positiu (o 0 per anul·lar)");
        const nifNet = nif.trim().toUpperCase();
        const existent = this.#reserves.find((r) => r.nif === nifNet);
        const abans = existent ? existent.habitacions : 0;
        if (places === 0) {
            if (!existent)
                throw new Error("No hi ha cap reserva amb aquest NIF");
            this.#reserves.splice(this.#reserves.indexOf(existent), 1);
            this.#habitacionsLliures += abans;
            return true;
        }
        const necessaries = individuals ? places : Math.ceil(places / 2);
        if (necessaries > this.#habitacionsLliures + abans)
            return false;
        if (existent) {
            existent.places = places;
            existent.individuals = individuals;
        }
        else {
            this.#reserves.push(new Reserva(nifNet, places, individuals));
        }
        this.#habitacionsLliures += abans - necessaries;
        return true;
    }
    filaHtml() {
        return `<tr><td class="centre">${this.#id}</td><td>${escapeHtml(this.#nom)}</td><td>${escapeHtml(this.#poblacio)}</td><td class="centre">${this.#habitacions}</td><td class="centre">${this.#habitacionsLliures}</td></tr>`;
    }
    taulaReservesHtml() {
        if (this.#reserves.length === 0)
            return "<p>Aquest hotel no té reserves.</p>";
        return "<table><thead><tr><th>NIF</th><th>Places</th><th>Individuals</th><th>Habitacions</th></tr></thead><tbody>" +
            this.#reserves.map((r) => r.filaHtml()).join("") + "</tbody></table>";
    }
}
//# sourceMappingURL=Hotel.js.map