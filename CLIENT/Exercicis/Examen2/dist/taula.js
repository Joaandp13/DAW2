const parametres = new URLSearchParams(window.location.search);
const idFinestra = parametres.get("id");
const idSessio = parametres.get("sessio");
const dniInput = document.getElementById("dni");
const boton1 = document.getElementById("pizza");
const boton2 = document.getElementById("hamburgesa");
const boton3 = document.getElementById("pollastre");
const boton4 = document.getElementById("salmo");
const botons = [boton1, boton2, boton3, boton4];
const missatgeEstat = document.createElement("p");
missatgeEstat.setAttribute("role", "status");
document.body.append(missatgeEstat);
let idPeticioActual = "";
let comptadorPeticio = 0;
const prefix_vot = "votacions:vot:";
const prefix_resposta = "votacions:resposta:";
if (!idFinestra || !idSessio || !dniInput || botons.length === 0) {
    throw new Error("No s'han trobat les dades necessàries per registrar el vot.");
}
const opcions = botons.map((boto) => ({
    id: boto.id,
    nom: boto.textContent?.trim() ?? boto.id
}));
function rebreResposta(e) {
    const prefixResposta = `${prefix_resposta}${idFinestra}:`;
    if (!e.key?.startsWith(prefixResposta) || !e.newValue) {
        return;
    }
    const resposta = JSON.parse(e.newValue);
    if (resposta.idSessio !== idSessio ||
        resposta.idFinestra !== idFinestra ||
        resposta.idPeticio !== idPeticioActual) {
        return;
    }
    missatgeEstat.textContent = resposta.acceptat
        ? "Vot registrat correctament."
        : "Aquest DNI ja ha votat o no és vàlid.";
}
window.addEventListener("storage", rebreResposta);
localStorage.setItem(`${prefix_vot}${idSessio}:${idFinestra}:${Date.now()}`, JSON.stringify({ type: "ready", idSessio, opcions }));
function votar(boto) {
    const dni = dniInput.value.trim();
    if (dni === "") {
        missatgeEstat.textContent = "Introdueix el DNI abans de votar.";
        dniInput.focus();
        return;
    }
    comptadorPeticio += 1;
    idPeticioActual = `${Date.now()}-${comptadorPeticio}`;
    const missatge = {
        type: "vote",
        idSessio: idSessio,
        idFinestra: idFinestra,
        idPeticio: idPeticioActual,
        dni,
        idOpcio: boto.id,
        nomOpcio: boto.textContent?.trim() ?? boto.id
    };
    missatgeEstat.textContent = "Enviant el vot...";
    localStorage.setItem(`${prefix_vot}${idSessio}:${idPeticioActual}`, JSON.stringify(missatge));
}
boton1.addEventListener("click", () => votar(boton1));
boton2.addEventListener("click", () => votar(boton2));
boton3.addEventListener("click", () => votar(boton3));
boton4.addEventListener("click", () => votar(boton4));
export {};
//# sourceMappingURL=taula.js.map