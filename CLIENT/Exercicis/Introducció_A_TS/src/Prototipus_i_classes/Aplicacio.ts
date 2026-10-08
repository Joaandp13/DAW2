// Punt d'entrada de HotelsReserves.html (gestió d'esdeveniments)
import { obtenir } from "../comu/ui.js";
import { Empresa } from "./Empresa.js";

function missatge(text: string, error = false): void {
    const m = obtenir("missatge-h");
    m.textContent = text;
    m.className = error ? "error" : "ok";
}

function pintar(): void {
    const select = obtenir<HTMLSelectElement>("hotel");
    const triat = select.value;
    select.innerHTML = Array.from({ length: Empresa.totalHotels }, (_, i) => `<option value="${i}">${Empresa.getHotel(i)}</option>`).join("");
    if (triat) select.value = triat;
    obtenir("taula-hotels").innerHTML = Empresa.mostrarHotels();
    obtenir("taula-reserves").innerHTML = Empresa.mostrarReservesHotel(parseInt(select.value, 10));
}

function intentar(accio: () => void): void {
    try { accio(); pintar(); }
    catch (e) { missatge(e instanceof Error ? e.message : String(e), true); }
}

Empresa.afegirHotel("Best World Palace", "Barcelona", 20);
Empresa.afegirHotel("Best World Beach", "Sant Feliu de Guíxols", 12);
Empresa.afegirHotel("Best World Mountain", "La Molina", 8);

const dades = () => ({
    ndx: parseInt(obtenir<HTMLSelectElement>("hotel").value, 10),
    nif: obtenir<HTMLInputElement>("nif").value,
    places: parseInt(obtenir<HTMLInputElement>("places").value, 10),
    individuals: obtenir<HTMLInputElement>("individuals").checked,
});

obtenir("btn-reservar").addEventListener("click", () => intentar(() => {
    const d = dades();
    if (Empresa.reservarHotel(d.ndx, d.nif, d.places, d.individuals)) missatge("Reserva feta (o modificada)");
    else missatge("No hi ha prou habitacions lliures: no s'ha fet cap canvi", true);
}));
obtenir("btn-anular").addEventListener("click", () => intentar(() => {
    const d = dades();
    Empresa.anularReserva(d.ndx, d.nif);
    missatge("Reserva anul·lada");
}));
obtenir("hotel").addEventListener("change", pintar);
pintar();
