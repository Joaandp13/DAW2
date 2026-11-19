import { Message } from "./tipus.js";

const h2 = document.getElementById("username") as HTMLHeadingElement;
const chat = document.getElementById("chat") as HTMLTextAreaElement;
const messageInput = document.getElementById("message") as HTMLInputElement;
const sendButton = document.getElementById("send") as HTMLButtonElement;
const stop1 = document.getElementById("stop1") as HTMLButtonElement;
const stop2 = document.getElementById("stop2") as HTMLButtonElement;
const clearButton = document.getElementById("clear") as HTMLButtonElement;

const nom = "Admin";

h2.textContent = nom;
document.title = nom;

// Referències a les finestres dels usuaris (null si no s'han obert o s'han bloquejat)
const finestres: (Window | null)[] = [null, null];

// Obre la finestra d'un usuari a la meitat dreta: index 0 a dalt, index 1 a baix
function obrirFinestres(index: number) {
    const width = Math.floor(screen.availWidth / 2);
    const height = Math.floor(screen.availHeight / 2);
    const left = Math.floor(screen.availWidth / 2);
    const top = index * height;

    const url = `user.html?name=Usuari${index + 1}`;
    const features = `width=${width},height=${height},left=${left},top=${top}`;
    finestres[index] = window.open(url, "user" + index, features);
}

// Només obre les finestres que no existeixen o s'han tancat
function obrirFinestresTancades() {
    for (let i = 0; i <= 1; ++i) {
        if (finestres[i] === null || finestres[i]?.closed) {
            obrirFinestres(i);
        }
    }
}

// Afegeix el missatge al principi de l'àrea de text
function afegirMissatge(msg: Message) {
    if (msg.type === "clear") chat.value = "";
    if (msg.type === "message") {
        const newline = `${msg.user}: ${msg.text}`;
        if (chat.value !== "") {
            chat.value = newline + "\n" + chat.value;
        } else {
            chat.value = newline;
        }
    }
}

function netejarXat() {
    // L'admin no rep el seu propi esdeveniment "storage", així que s'esborra a mà
    chat.value = "";
    const clearmsg: Message = {
        id: Date.now(), // id nou perquè l'esdeveniment salti als usuaris
        type: "clear",
        user: "",
        text: ""
    };
    localStorage.setItem("broadcast", JSON.stringify(clearmsg));
    obrirFinestresTancades();
}

function enviar() {
    const text = messageInput.value.trim();
    if (text === "") {
        return;
    }

    const msg: Message = {
        id: Date.now(),
        user: nom,
        text: text,
        type: "message"
    };
    afegirMissatge(msg); // es mostra a si mateix directament
    localStorage.setItem("broadcast", JSON.stringify(msg));
    messageInput.value = "";
    messageInput.focus();
}

sendButton.addEventListener("click", enviar);
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") enviar();
});

// Missatges dels usuaris: es mostren a l'admin i es retransmeten a tothom
window.addEventListener("storage", (e) => {
    if (e.key !== "inbox") {
        return;
    }
    if (e.newValue === null) {
        return;
    }
    const msg = JSON.parse(e.newValue) as Message;
    afegirMissatge(msg);
    localStorage.setItem("broadcast", JSON.stringify(msg));
});

stop1.addEventListener("click", () => {
    finestres[0]?.close();
});

stop2.addEventListener("click", () => {
    finestres[1]?.close();
});

clearButton.addEventListener("click", netejarXat);

// En arrencar l'aplicació s'obren les dues finestres automàticament
// (el navegador pot demanar permís per a popups la primera vegada)
obrirFinestresTancades();