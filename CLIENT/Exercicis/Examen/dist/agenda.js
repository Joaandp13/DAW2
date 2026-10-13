export class Agenda {
    static contactes = new Map();
    afegir(contacte) {
        if (Agenda.contactes.has(contacte.telefon)) {
            throw new Error("Ya existeix un contacte amb aquest telèfon.");
        }
        Agenda.contactes.set(contacte.telefon, contacte);
    }
    modificar(telefon, nom, email, categoria) {
        const contacte = Agenda.contactes.get(telefon);
        if (!contacte) {
            throw new Error("No existix un contacte amb aquest telèfon");
        }
        contacte.modificar(nom, email, categoria);
    }
    llistar() {
        return Array.from(Agenda.contactes.values());
    }
    ordenats() {
        return this.llistar().sort((a, b) => a.nom.localeCompare(b.nom));
    }
    filtrarPerCategoria(cat) {
        return this.llistar().filter((contacte) => contacte.categoria === cat);
    }
    noms() {
        return this.llistar().map((contacte) => contacte.nom);
    }
    hiHaCategoria(cat) {
        return this.llistar().some((contacte) => contacte.categoria === cat);
    }
    eliminar(telefon) {
        return Agenda.contactes.delete(telefon);
    }
    cercar(telefon) {
        return Agenda.contactes.get(telefon);
    }
    cercarPerEmail(email) {
        return Array.from(Agenda.contactes.values()).find((contacte) => contacte.email === email);
    }
}
//# sourceMappingURL=agenda.js.map