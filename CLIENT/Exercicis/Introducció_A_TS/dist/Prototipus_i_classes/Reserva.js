import { nifValid } from "../comu/nif.js";
import { escapeHtml } from "../comu/ui.js";
export class Reserva {
    #nif;
    #places = 0;
    #individuals = false;
    constructor(nif, places, individuals) {
        this.#nif = nif.trim().toUpperCase();
        this.#verificarNIF();
        this.places = places;
        this.individuals = individuals;
    }
    #verificarNIF() {
        if (!nifValid(this.#nif))
            throw new Error(`El NIF ${this.#nif} no és correcte`);
    }
    get nif() { return this.#nif; }
    get places() { return this.#places; }
    set places(valor) {
        if (!Number.isInteger(valor) || valor <= 0)
            throw new RangeError("El nombre de places ha de ser un enter positiu");
        this.#places = valor;
    }
    get individuals() { return this.#individuals; }
    set individuals(valor) { this.#individuals = valor; }
    get habitacions() {
        return this.#individuals ? this.#places : Math.ceil(this.#places / 2);
    }
    filaHtml() {
        return `<tr><td>${escapeHtml(this.#nif)}</td><td class="centre">${this.#places}</td><td class="centre">${this.#individuals ? "Sí" : "No"}</td><td class="centre">${this.habitacions}</td></tr>`;
    }
}
//# sourceMappingURL=Reserva.js.map