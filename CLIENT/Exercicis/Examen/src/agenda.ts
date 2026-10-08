import { Contacte, TCategoria } from "./contacte.js";

export class Agenda {
    private static readonly contactes: Map<string, Contacte> = new Map();

    public afegir(contacte: Contacte): void {
        if (Agenda.contactes.has(contacte.telefon)) {
            throw new Error("Ya existe un contacto con este teléfono");
        }

        Agenda.contactes.set(contacte.telefon, contacte);
    }


    public modificar(telefon: string, nom: string, email: string, categoria: TCategoria): void {
        const contacte = Agenda.contactes.get(telefon);

        if (!contacte) {
            throw new Error("No existe un contacto con este teléfono");
        }

        contacte.modificar(nom, email, categoria);
    }

    public llistar(): Contacte[] {
        return Array.from(Agenda.contactes.values());
    }

    public ordenats(): Contacte[] {
        // Ordena una còpia per no canviar l'ordre de l'agenda.
        return this.llistar().sort((a, b) => a.nom.localeCompare(b.nom));
    }

    public filtrarPerCategoria(cat: TCategoria): Contacte[] {
        // Retorna només els contactes de la categoria indicada.
        return this.llistar().filter((contacte) => contacte.categoria === cat);
    }

    public noms(): string[] {
        return this.llistar().map((contacte) => contacte.nom);
    }

    public hiHaCategoria(cat: TCategoria): boolean {
        // Comprova si existeix algun contacte d'aquesta categoria.
        return this.llistar().some((contacte) => contacte.categoria === cat);
    }

    public eliminar(telefon: string): boolean {
        return Agenda.contactes.delete(telefon);
    }
    public cercar(telefon: string): Contacte | undefined {
        return Agenda.contactes.get(telefon);
    }

    public cercarPerEmail(email: string): Contacte | undefined {
        return Array.from(Agenda.contactes.values()).find((contacte) => contacte.email === email);
    }

    
    


}
