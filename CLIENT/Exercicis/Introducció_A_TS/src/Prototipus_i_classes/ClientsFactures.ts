// Punt d'entrada de ClientsFactures.html: objecte que rep les accions de l'usuari
import { obtenir } from "../comu/ui.js";
import { Client, Factura, GestioClients, GestioFactures } from "./Facturacio.js";

const App = {
    missatge(text: string, error = false): void {
        const m = obtenir("missatge-cf");
        m.textContent = text;
        m.className = error ? "error" : "ok";
    },

    /** Executa una acció i mostra l'error si llença una excepció. */
    intentar(accio: () => void): void {
        try { accio(); this.pintar(); }
        catch (e) { this.missatge(e instanceof Error ? e.message : String(e), true); }
    },

    afegirClient(): void {
        this.intentar(() => {
            const nif = obtenir<HTMLInputElement>("c-nif").value;
            const nom = obtenir<HTMLInputElement>("c-nom").value;
            const cognoms = obtenir<HTMLInputElement>("c-cognoms").value;
            GestioClients.afegir(new Client(nif, nom, cognoms));
            this.missatge("Client afegit");
        });
    },

    afegirFactura(): void {
        this.intentar(() => {
            const idClient = parseInt(obtenir<HTMLSelectElement>("f-client").value, 10);
            const data = obtenir<HTMLInputElement>("f-data").value;
            const importe = parseFloat(obtenir<HTMLInputElement>("f-import").value);
            const pagada = obtenir<HTMLInputElement>("f-pagada").checked;
            GestioFactures.afegir(new Factura(idClient, data, importe, pagada));
            this.missatge("Factura afegida");
        });
    },

    pintar(): void {
        obtenir("taula-clients").innerHTML = GestioClients.taula();
        const select = obtenir<HTMLSelectElement>("f-client");
        const triat = select.value;
        select.innerHTML = GestioClients.clients.map((c) => `<option value="${c.id}">${c.id} - ${c.nom} ${c.cognoms}</option>`).join("");
        if (triat) select.value = triat;
        const id = parseInt(select.value, 10);
        obtenir("taula-factures").innerHTML = Number.isNaN(id) ? "" : GestioFactures.taulaClient(id);
    },
};

// Dades d'exemple
GestioClients.afegir(new Client("12345678Z", "Pere", "Sánchez"));
GestioClients.afegir(new Client("45454545J", "Ainhoa", "Zaldua"));
GestioFactures.afegir(new Factura(10, "2026-01-15", 120.5, true));
GestioFactures.afegir(new Factura(10, "2026-02-03", 80, false));
GestioFactures.afegir(new Factura(11, "2026-02-10", 300, false));

obtenir("btn-client").addEventListener("click", () => App.afegirClient());
obtenir("btn-factura").addEventListener("click", () => App.afegirFactura());
obtenir("f-client").addEventListener("change", () => App.pintar());
App.pintar();
