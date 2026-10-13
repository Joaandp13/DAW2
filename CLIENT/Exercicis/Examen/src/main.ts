import { DADES_PROVA } from './dades.js';
import { Agenda } from './agenda.js';
import { Contacte } from './contacte.js';
import type { TCategoria, TDadesContacte } from './contacte.js';

// Inputs i resultats
const inNom = <HTMLInputElement>document.getElementById("nom");
const inTelefon = <HTMLInputElement>document.getElementById("telefon");
const inEmail = <HTMLInputElement>document.getElementById("email");
const selCategoria = <HTMLSelectElement>document.getElementById("categoria");
const divResultat = <HTMLDivElement>document.getElementById("resultat");

// Botons
const btnAfegir = document.getElementById("btnAfegir")!;
const btnCercar = document.getElementById("btnCercar")!;
const btnModificar = document.getElementById("btnModificar")!;
const btnEliminar = document.getElementById("btnEliminar")!;
const btnLlistar = document.getElementById("btnLlistar")!;
const btnOrdenar = document.getElementById("btnOrdenar")!;
const btnFiltrar = document.getElementById("btnFiltrar")!;

const agenda = new Agenda();

function obtenirCategoria(): TCategoria {
    const categoria = selCategoria.value;

    // Comprova que la categoria sigui vàlida.
    if (categoria === "familia" || categoria === "amics" || categoria === "feina") {
        return categoria;
    }

    throw new Error("La categoria seleccionada no és vàlida.");
}

function mostrarContactes(contactes: Contacte[]): void {
    if (contactes.length === 0) {
        divResultat.textContent = "No s'han trobat contactes.";
        return;
    }

    // Crea una línia per a cada contacte.
    divResultat.replaceChildren(...contactes.map((contacte) => {
        const linia = document.createElement("p");
        linia.textContent = contacte.toString();
        return linia;
    }));
}

function mostrarError(error: unknown): void {
    divResultat.textContent = error instanceof Error ? error.message : String(error);
}

btnAfegir.addEventListener("click", () => {
    try {
        const contacte = new Contacte({
            nom: inNom.value,
            telefon: inTelefon.value,
            email: inEmail.value,
            categoria: obtenirCategoria()
        });
        agenda.afegir(contacte);
        divResultat.textContent = `S'ha afegit el contacte ${contacte.nom}.`;
    } catch (error) {
        alert(error instanceof Error ? error.message : String(error));
    }
});

btnCercar.addEventListener("click", () => {
    const contacte = agenda.cercar(inTelefon.value);

    if (!contacte) {
        divResultat.textContent = "No s'ha trobat cap contacte amb aquest telèfon.";
        return;
    }

    inNom.value = contacte.nom;
    inEmail.value = contacte.email;
    selCategoria.value = contacte.categoria;
    mostrarContactes([contacte]);
});

btnModificar.addEventListener("click", () => {
    try {
        agenda.modificar(inTelefon.value, inNom.value, inEmail.value, obtenirCategoria());
        divResultat.textContent = "S'ha modificat el contacte.";
    } catch (error) {
        alert(error instanceof Error ? error.message : String(error));
    }
});

btnEliminar.addEventListener("click", () => {
    const eliminat = agenda.eliminar(inTelefon.value);
    divResultat.textContent = eliminat
        ? "S'ha eliminat el contacte."
        : "No s'ha trobat cap contacte amb aquest telèfon.";
});

btnLlistar.addEventListener("click", () => {
    mostrarContactes(agenda.llistar());
});

btnOrdenar.addEventListener("click", () => {
    mostrarContactes(agenda.ordenats());
});

btnFiltrar.addEventListener("click", () => {
    try {
        mostrarContactes(agenda.filtrarPerCategoria(obtenirCategoria()));
    } catch (error) {
        mostrarError(error);
    }
});


function carregarDadesProva(dades: unknown): void {
    const dadesProva: unknown[] = Array.isArray(dades) ? dades : [];
    let dadesAcceptades = 0;
    let dadesRebutjades = 0;
    const errors: string[] = [];

    // Verifica l'estructura abans de crear cada contacte.
    const esDadaContacte = (dada: unknown): dada is TDadesContacte =>
        dada !== null
        && typeof dada === "object"
        && "nom" in dada
        && typeof dada.nom === "string"
        && "telefon" in dada
        && typeof dada.telefon === "string"
        && "email" in dada
        && typeof dada.email === "string"
        && "categoria" in dada
        && (dada.categoria === "familia" || dada.categoria === "amics" || dada.categoria === "feina");

    dadesProva.forEach((dada) => {
        if (!esDadaContacte(dada)) {
            dadesRebutjades++;
            errors.push("La dada no té una estructura de contacte vàlida.");
            return;
        }

        try {
            agenda.afegir(new Contacte(dada));
            dadesAcceptades++;
        } catch (error) {
            dadesRebutjades++;
            errors.push(error instanceof Error ? error.message : String(error));
        }
    });

    // Mostra el resum i els errors de les dades rebutjades.
    const resum = `S'han afegit ${dadesAcceptades} contactes de prova. S'han rebutjat ${dadesRebutjades} dades.\n`;
    divResultat.textContent = errors.length > 0 ? `${resum} ${errors.join("\n")}` : resum;
}

carregarDadesProva(DADES_PROVA);
