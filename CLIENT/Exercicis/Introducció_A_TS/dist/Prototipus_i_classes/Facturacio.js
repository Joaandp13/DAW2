import { nifValid } from "../comu/nif.js";
import { escapeHtml } from "../comu/ui.js";
export function crearGenerador(ini, max, nom) {
    let darrer = ini - 1;
    return () => {
        if (darrer >= max)
            throw new Error(`S'ha arribat al límit d'identificadors de ${nom} (${max})`);
        return ++darrer;
    };
}
const nouIdClient = crearGenerador(10, 99, "clients");
const nouIdFactura = crearGenerador(100, 999, "factures");
export class Client {
    nom;
    cognoms;
    id;
    nif;
    constructor(nif, nom, cognoms) {
        this.nom = nom;
        this.cognoms = cognoms;
        this.nif = nif.trim().toUpperCase();
        if (!nifValid(this.nif))
            throw new Error(`El NIF ${this.nif} no és correcte`);
        if (!nom.trim() || !cognoms.trim())
            throw new Error("El nom i els cognoms són obligatoris");
        this.id = nouIdClient();
    }
}
export class Factura {
    idClient;
    data;
    import_;
    pagada;
    id;
    constructor(idClient, data, import_, pagada) {
        this.idClient = idClient;
        this.data = data;
        this.import_ = import_;
        this.pagada = pagada;
        if (!GestioClients.buscarPerId(idClient))
            throw new Error(`No existeix cap client amb l'identificador ${idClient}`);
        if (!(import_ > 0))
            throw new Error("L'import ha de ser més gran que 0");
        if (Number.isNaN(Date.parse(data)))
            throw new Error("La data no és vàlida");
        this.id = nouIdFactura();
    }
}
export class GestioClients {
    static clients = [];
    static afegir(client) {
        if (GestioClients.clients.some((c) => c.nif === client.nif))
            throw new Error(`Ja existeix un client amb el NIF ${client.nif}`);
        GestioClients.clients.push(client);
    }
    static buscarPerId(id) {
        return GestioClients.clients.find((c) => c.id === id);
    }
    static taula() {
        let html = "<table><thead><tr><th>Id</th><th>NIF</th><th>Nom</th><th>Cognoms</th></tr></thead><tbody>";
        for (const c of GestioClients.clients) {
            html += `<tr><td>${c.id}</td><td>${escapeHtml(c.nif)}</td><td>${escapeHtml(c.nom)}</td><td>${escapeHtml(c.cognoms)}</td></tr>`;
        }
        return html + "</tbody></table>";
    }
}
export class GestioFactures {
    static factures = [];
    static afegir(factura) {
        GestioFactures.factures.push(factura);
    }
    static deClient(idClient) {
        return GestioFactures.factures.filter((f) => f.idClient === idClient);
    }
    static taulaClient(idClient) {
        const llista = GestioFactures.deClient(idClient);
        if (llista.length === 0)
            return "<p>Aquest client no té factures.</p>";
        let html = "<table><thead><tr><th>Id</th><th>Data</th><th>Import</th><th>Pagada</th></tr></thead><tbody>";
        let pendent = 0;
        for (const f of llista) {
            if (!f.pagada)
                pendent += f.import_;
            html += `<tr><td>${f.id}</td><td>${escapeHtml(f.data)}</td><td class="dreta">${f.import_.toFixed(2)} €</td><td class="centre">${f.pagada ? "Sí" : "No"}</td></tr>`;
        }
        return html + `</tbody></table><p>Pendent de cobrament: <strong>${pendent.toFixed(2)} €</strong></p>`;
    }
}
//# sourceMappingURL=Facturacio.js.map