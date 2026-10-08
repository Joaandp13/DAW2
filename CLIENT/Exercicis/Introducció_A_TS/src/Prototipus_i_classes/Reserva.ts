// PROTOTIPUS I CLASSES - ex.3: classe Reserva (totes les propietats són privades)
import { nifValid } from "../comu/nif.js";
import { escapeHtml } from "../comu/ui.js";

export class Reserva {
    #nif: string;
    #places = 0;
    #individuals = false;

    constructor(nif: string, places: number, individuals: boolean) {
        this.#nif = nif.trim().toUpperCase();
        this.#verificarNIF();
        this.places = places;            // passa pel setter (es valida)
        this.individuals = individuals;
    }

    /** Mètode PRIVAT: llença una excepció si el NIF no és correcte. */
    #verificarNIF(): void {
        if (!nifValid(this.#nif)) throw new Error(`El NIF ${this.#nif} no és correcte`);
    }

    get nif(): string { return this.#nif; }

    get places(): number { return this.#places; }
    set places(valor: number) {
        if (!Number.isInteger(valor) || valor <= 0) throw new RangeError("El nombre de places ha de ser un enter positiu");
        this.#places = valor;
    }

    get individuals(): boolean { return this.#individuals; }
    set individuals(valor: boolean) { this.#individuals = valor; }

    /** Habitacions que ocupa: individuals = una per plaça; si no, habitacions dobles. */
    get habitacions(): number {
        return this.#individuals ? this.#places : Math.ceil(this.#places / 2);
    }

    filaHtml(): string {
        return `<tr><td>${escapeHtml(this.#nif)}</td><td class="centre">${this.#places}</td><td class="centre">${this.#individuals ? "Sí" : "No"}</td><td class="centre">${this.habitacions}</td></tr>`;
    }
}
