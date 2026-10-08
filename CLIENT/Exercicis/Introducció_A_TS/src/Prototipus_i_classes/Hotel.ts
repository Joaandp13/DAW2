// PROTOTIPUS I CLASSES - ex.3: classe Hotel (propietats privades)
import { Reserva } from "./Reserva.js";
import { escapeHtml } from "../comu/ui.js";

export class Hotel {
    static #properId = 0;                  // propietat estàtica i privada: comptador d'ids

    readonly #id: number;
    #nom: string;
    #poblacio: string;
    #habitacions: number;
    #habitacionsLliures: number;
    #reserves: Reserva[] = [];

    constructor(nom: string, poblacio: string, habitacions: number) {
        if (!nom.trim()) throw new Error("El nom de l'hotel no pot estar buit");
        if (!poblacio.trim()) throw new Error("La població no pot estar buida");
        if (!Number.isInteger(habitacions) || habitacions <= 0) throw new RangeError("L'hotel ha de tenir més de 0 habitacions");
        this.#id = Hotel.#properId++;
        this.#nom = nom.trim();
        this.#poblacio = poblacio.trim();
        this.#habitacions = habitacions;
        this.#habitacionsLliures = habitacions;
    }

    get id(): number { return this.#id; }
    get nom(): string { return this.#nom; }
    get poblacio(): string { return this.#poblacio; }
    get habitacions(): number { return this.#habitacions; }
    get habitacionsLliures(): number { return this.#habitacionsLliures; }

    /**
     * Crea o modifica la reserva d'un NIF.
     *  - places = 0 anul·la la reserva.
     *  - Si no hi ha prou habitacions lliures no es fa ni es modifica res (retorna false).
     */
    reservar(nif: string, places: number, individuals: boolean): boolean {
        if (!Number.isInteger(places) || places < 0) throw new RangeError("Les places han de ser un número positiu (o 0 per anul·lar)");
        const nifNet = nif.trim().toUpperCase();
        const existent = this.#reserves.find((r) => r.nif === nifNet);
        const abans = existent ? existent.habitacions : 0;      // habitacions que ja tenia aquest NIF

        if (places === 0) {                                      // anul·lar
            if (!existent) throw new Error("No hi ha cap reserva amb aquest NIF");
            this.#reserves.splice(this.#reserves.indexOf(existent), 1);
            this.#habitacionsLliures += abans;
            return true;
        }

        const necessaries = individuals ? places : Math.ceil(places / 2);
        if (necessaries > this.#habitacionsLliures + abans) return false;   // no hi ha prou lloc

        if (existent) {
            existent.places = places;
            existent.individuals = individuals;
        } else {
            this.#reserves.push(new Reserva(nifNet, places, individuals));  // valida el NIF
        }
        this.#habitacionsLliures += abans - necessaries;
        return true;
    }

    /** Fila de la taula d'hotels. */
    filaHtml(): string {
        return `<tr><td class="centre">${this.#id}</td><td>${escapeHtml(this.#nom)}</td><td>${escapeHtml(this.#poblacio)}</td><td class="centre">${this.#habitacions}</td><td class="centre">${this.#habitacionsLliures}</td></tr>`;
    }

    /** Taula amb les reserves de l'hotel. */
    taulaReservesHtml(): string {
        if (this.#reserves.length === 0) return "<p>Aquest hotel no té reserves.</p>";
        return "<table><thead><tr><th>NIF</th><th>Places</th><th>Individuals</th><th>Habitacions</th></tr></thead><tbody>" +
            this.#reserves.map((r) => r.filaHtml()).join("") + "</tbody></table>";
    }
}
