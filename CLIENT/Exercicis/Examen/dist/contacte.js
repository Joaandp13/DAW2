export class Contacte {
    _nom;
    _telefon;
    _email;
    _categoria;
    constructor(dades) {
        if (!/^[\p{L} ]+$/u.test(dades.nom) || dades.nom.length < 2 || dades.nom.length > 30) {
            throw new Error("El nom només pot tenir espais i lletres i entre 2 i 30 caracters.");
        }
        if (!/^[6-9][0-9]{8}$/.test(dades.telefon)) {
            throw new Error("El numero de telefon ha de tenir exactament 9 digits i començar per 6, 7, 8 o 9.");
        }
        if (!/^[^@]+@[^@]+\.[^@]+$/.test(dades.email)) {
            throw new Error("L'email no es valid");
        }
        if (!["familia", "amics", "feina"].includes(dades.categoria)) {
            throw new Error("La categoría ha de ser 'familia', 'amics' o 'feina'.");
        }
        this._nom = dades.nom;
        this._telefon = dades.telefon;
        this._email = dades.email;
        this._categoria = dades.categoria;
    }
    get nom() {
        return this._nom;
    }
    get telefon() {
        return this._telefon;
    }
    get email() {
        return this._email;
    }
    get categoria() {
        return this._categoria;
    }
    modificar(nom, email, categoria) {
        if (!/^[\p{L} ]+$/u.test(nom) || nom.length < 2 || nom.length > 30) {
            throw new Error("El nom només pot tenir espais i lletres i entre 2 i 30 caracters.");
        }
        if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
            throw new Error("L'email no es valid");
        }
        if (categoria !== "familia" && categoria !== "amics" && categoria !== "feina") {
            throw new Error("La categoría ha de ser 'familia', 'amics' o 'feina'.");
        }
        this._nom = nom;
        this._email = email;
        this._categoria = categoria;
    }
    toString() {
        return `${this._nom} · ${this._telefon} · ${this._email}`;
    }
}
//# sourceMappingURL=contacte.js.map