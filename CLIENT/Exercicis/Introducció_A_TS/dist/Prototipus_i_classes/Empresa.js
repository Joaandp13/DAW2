import { Hotel } from "./Hotel.js";
export class Empresa {
    static #hotels = [];
    static #hotel(ndx) {
        if (!Number.isInteger(ndx) || ndx < 0 || ndx >= Empresa.#hotels.length)
            throw new RangeError("L'hotel triat no existeix");
        return Empresa.#hotels[ndx];
    }
    static getHotel(ndx) {
        const h = Empresa.#hotel(ndx);
        return `${h.nom} (${h.poblacio})`;
    }
    static afegirHotel(nom, poblacio, habitacions) {
        Empresa.#hotels.push(new Hotel(nom, poblacio, habitacions));
    }
    static get totalHotels() { return Empresa.#hotels.length; }
    static reservarHotel(ndx, nif, places, individuals) {
        if (!Number.isInteger(places) || places <= 0)
            throw new RangeError("El nombre de places ha de ser més gran que 0");
        return Empresa.#hotel(ndx).reservar(nif, places, individuals);
    }
    static anularReserva(ndx, nif) {
        Empresa.#hotel(ndx).reservar(nif, 0, false);
    }
    static mostrarHotels() {
        return "<table><thead><tr><th>Id</th><th>Hotel</th><th>Població</th><th>Habitacions</th><th>Lliures</th></tr></thead><tbody>" +
            Empresa.#hotels.map((h) => h.filaHtml()).join("") + "</tbody></table>";
    }
    static mostrarReservesHotel(ndx) {
        return Empresa.#hotel(ndx).taulaReservesHtml();
    }
}
//# sourceMappingURL=Empresa.js.map