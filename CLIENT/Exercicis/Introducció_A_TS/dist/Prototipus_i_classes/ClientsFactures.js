import { obtenir } from "../comu/ui.js";
import { Client, Factura, GestioClients, GestioFactures } from "./Facturacio.js";
const App = {
    missatge(text, error = false) {
        const m = obtenir("missatge-cf");
        m.textContent = text;
        m.className = error ? "error" : "ok";
    },
    intentar(accio) {
        try {
            accio();
            this.pintar();
        }
        catch (e) {
            this.missatge(e instanceof Error ? e.message : String(e), true);
        }
    },
    afegirClient() {
        this.intentar(() => {
            const nif = obtenir("c-nif").value;
            const nom = obtenir("c-nom").value;
            const cognoms = obtenir("c-cognoms").value;
            GestioClients.afegir(new Client(nif, nom, cognoms));
            this.missatge("Client afegit");
        });
    },
    afegirFactura() {
        this.intentar(() => {
            const idClient = parseInt(obtenir("f-client").value, 10);
            const data = obtenir("f-data").value;
            const importe = parseFloat(obtenir("f-import").value);
            const pagada = obtenir("f-pagada").checked;
            GestioFactures.afegir(new Factura(idClient, data, importe, pagada));
            this.missatge("Factura afegida");
        });
    },
    pintar() {
        obtenir("taula-clients").innerHTML = GestioClients.taula();
        const select = obtenir("f-client");
        const triat = select.value;
        select.innerHTML = GestioClients.clients.map((c) => `<option value="${c.id}">${c.id} - ${c.nom} ${c.cognoms}</option>`).join("");
        if (triat)
            select.value = triat;
        const id = parseInt(select.value, 10);
        obtenir("taula-factures").innerHTML = Number.isNaN(id) ? "" : GestioFactures.taulaClient(id);
    },
};
GestioClients.afegir(new Client("12345678Z", "Pere", "Sánchez"));
GestioClients.afegir(new Client("45454545J", "Ainhoa", "Zaldua"));
GestioFactures.afegir(new Factura(10, "2026-01-15", 120.5, true));
GestioFactures.afegir(new Factura(10, "2026-02-03", 80, false));
GestioFactures.afegir(new Factura(11, "2026-02-10", 300, false));
obtenir("btn-client").addEventListener("click", () => App.afegirClient());
obtenir("btn-factura").addEventListener("click", () => App.afegirFactura());
obtenir("f-client").addEventListener("change", () => App.pintar());
App.pintar();
//# sourceMappingURL=ClientsFactures.js.map