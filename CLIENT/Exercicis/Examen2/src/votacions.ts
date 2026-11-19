import { MissatgePreparat , MissatgeVot , RespostaVot} from "./tipus.js";




type MissatgeEntrada = MissatgeVot | MissatgePreparat;


// A nombre_finestres es posa el nombre de finestres, 
// no se com fer perque el grid s'adapti al nombre de finestres totals
const nombre_finestres = 6;
const amplada_finestra = window.outerWidth / nombre_finestres;
const alcada_finestra = window.outerHeight / 2;
const resultatsElement = document.getElementById("resultats") as HTMLDivElement;
const botoVotacions = document.getElementById("votacions") as HTMLButtonElement;
const votants = new Set<string>();
const resultats = new Map<string, { nom: string; vots: number }>();
const finestres: Window[] = [];
let idSessioActual = "";
const prefix_vot = "votacions:vot:";
const prefix_resposta = "votacions:resposta:";




function mostrarResultats() {
    if (votants.size === 0) {
        resultatsElement.textContent = "Encara no hi ha cap resultat";
        return;
    }

    const resultatsOrdenats = Array.from(resultats.entries()).sort(
        ([, primer], [, segon]) =>
            segon.vots - primer.vots || primer.nom.localeCompare(segon.nom)
    );
    resultatsElement.textContent = resultatsOrdenats
        .map(([, resultat]) => `${resultat.nom}: ${resultat.vots} vots`)
        .join("\n");
}

function tancarFinestres() {
    finestres.forEach((finestra) => {
        if (!finestra.closed) {
            finestra.close();
        }
    });
    finestres.length = 0;
}

function netejarMissatges() {
    Object.keys(localStorage)
        .filter((clau) => clau.startsWith("votacions:"))
        .forEach((clau) => localStorage.removeItem(clau));
}

function començarVotacions() {
    if (!Number.isInteger(nombre_finestres) || nombre_finestres < 1) {
        throw new Error("El nombre de finestres ha de ser un enter superior a zero.");
    }

    tancarFinestres();
    netejarMissatges();
    votants.clear();
    resultats.clear();
    idSessioActual = Date.now().toString();
    mostrarResultats();

    const columnes = Math.ceil(Math.sqrt(nombre_finestres));
    const files = Math.ceil(nombre_finestres / columnes);
    const ampladaCella = Math.floor(screen.availWidth / columnes);
    const alcadaCella = Math.floor(screen.availHeight / files);
    const urlTaula = new URL("./taula.html", window.location.href);

    Array.from({ length: nombre_finestres }, (_, index) => {
        const fila = Math.floor(index / columnes);
        const columna = index % columnes;
        const idFinestra = `${idSessioActual}-${index}`;
        urlTaula.searchParams.set("id", idFinestra);
        urlTaula.searchParams.set("sessio", idSessioActual);

        const finestra = window.open(
            urlTaula.toString(),
            `taula-${idFinestra}`,
            [
                `width=${Math.min(amplada_finestra, ampladaCella)}`,
                `height=${Math.min(alcada_finestra, alcadaCella)}`,
                `left=${columna * ampladaCella}`,
                `top=${fila * alcadaCella}`,
                "resizable=yes"
            ].join(",")
        );

        if (!finestra) {
            throw new Error(
                "No s'ha pogut obrir una finestra. Permet les finestres emergents i torna-ho a provar."
            );
        }

        finestres.push(finestra);
    });
}

function processarMissatge(e: StorageEvent) {
    if (!e.key || !e.newValue || !e.key.startsWith(prefix_vot)) {
        return;
    }

    const missatge = JSON.parse(e.newValue) as MissatgeEntrada;
    if (missatge.idSessio !== idSessioActual) {
        localStorage.removeItem(e.key);
        return;
    }

    if (missatge.type === "ready") {
        missatge.opcions.forEach(({ id, nom }) => {
            if (!resultats.has(id)) {
                resultats.set(id, { nom, vots: 0 });
            }
        });
        
        return;
    }

    const dni = missatge.dni.trim();
    const acceptat = dni !== "" && !votants.has(dni);
    if (acceptat) {
        votants.add(dni);
        const resultat = resultats.get(missatge.idOpcio) ?? {
            nom: missatge.nomOpcio,
            vots: 0
        };
        resultat.vots += 1;
        resultats.set(missatge.idOpcio, resultat);
        mostrarResultats();
    }

    const resposta: RespostaVot = {
        type: "vote-result",
        idSessio: idSessioActual,
        idFinestra: missatge.idFinestra,
        idPeticio: missatge.idPeticio,
        acceptat
    };
    const clauResposta = `${prefix_resposta}${missatge.idFinestra}:${missatge.idPeticio}`;
    localStorage.setItem(clauResposta, JSON.stringify(resposta));
    
}

window.addEventListener("storage", processarMissatge);
botoVotacions.addEventListener("click", () => {
    try {
        començarVotacions();
    } catch (e) {
        tancarFinestres();
        resultatsElement.textContent =
            e instanceof Error ? e.message : "No s'han pogut iniciar les votacions.";
    }
});

mostrarResultats();
