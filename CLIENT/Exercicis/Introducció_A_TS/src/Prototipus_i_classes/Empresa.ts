// PROTOTIPUS I CLASSES - ex.3: classe Empresa (tot estàtic: propietats privades, mètodes públics)
import { Hotel } from "./Hotel.js";

export class Empresa {
    static #hotels: Hotel[] = [];

    /** Mètode privat estàtic: comprova que ndx és una posició correcta i retorna l'hotel. */
    static #hotel(ndx: number): Hotel {
        if (!Number.isInteger(ndx) || ndx < 0 || ndx >= Empresa.#hotels.length) throw new RangeError("L'hotel triat no existeix");
        return Empresa.#hotels[ndx];
    }

    /** "Nom_hotel (Població)" */
    static getHotel(ndx: number): string {
        const h = Empresa.#hotel(ndx);
        return `${h.nom} (${h.poblacio})`;
    }

    static afegirHotel(nom: string, poblacio: string, habitacions: number): void {
        Empresa.#hotels.push(new Hotel(nom, poblacio, habitacions));
    }

    static get totalHotels(): number { return Empresa.#hotels.length; }

    /** Retorna true si s'ha pogut fer/modificar la reserva i false si no hi ha prou habitacions. */
    static reservarHotel(ndx: number, nif: string, places: number, individuals: boolean): boolean {
        if (!Number.isInteger(places) || places <= 0) throw new RangeError("El nombre de places ha de ser més gran que 0");
        return Empresa.#hotel(ndx).reservar(nif, places, individuals);
    }

    /** Extra: anul·la la reserva (places = 0 a nivell d'Hotel). */
    static anularReserva(ndx: number, nif: string): void {
        Empresa.#hotel(ndx).reservar(nif, 0, false);
    }

    static mostrarHotels(): string {
        return "<table><thead><tr><th>Id</th><th>Hotel</th><th>Població</th><th>Habitacions</th><th>Lliures</th></tr></thead><tbody>" +
            Empresa.#hotels.map((h) => h.filaHtml()).join("") + "</tbody></table>";
    }

    static mostrarReservesHotel(ndx: number): string {
        return Empresa.#hotel(ndx).taulaReservesHtml();
    }
}
