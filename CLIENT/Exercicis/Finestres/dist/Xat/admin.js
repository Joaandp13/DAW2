const h2 = document.getElementById("username");
const chat = document.getElementById("chat");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const stop1 = document.getElementById("stop1");
const stop2 = document.getElementById("stop2");
const clearButton = document.getElementById("clear");
const nom = "Admin";
h2.textContent = nom;
document.title = nom;
const finestres = [null, null];
function obrirFinestres(index) {
    const width = Math.floor(screen.availWidth / 2);
    const height = Math.floor(screen.availHeight / 2);
    const left = Math.floor(screen.availWidth / 2);
    const top = index * height;
    const url = `user.html?name=Usuari${index + 1}`;
    const features = `width=${width},height=${height},left=${left},top=${top}`;
    finestres[index] = window.open(url, "user" + index, features);
}
function obrirFinestresTancades() {
    for (let i = 0; i <= 1; ++i) {
        if (finestres[i] === null || finestres[i]?.closed) {
            obrirFinestres(i);
        }
    }
}
function afegirMissatge(msg) {
    if (msg.type === "clear")
        chat.value = "";
    if (msg.type === "message") {
        const newline = `${msg.user}: ${msg.text}`;
        if (chat.value !== "") {
            chat.value = newline + "\n" + chat.value;
        }
        else {
            chat.value = newline;
        }
    }
}
function netejarXat() {
    chat.value = "";
    const clearmsg = {
        id: Date.now(),
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
    const msg = {
        id: Date.now(),
        user: nom,
        text: text,
        type: "message"
    };
    afegirMissatge(msg);
    localStorage.setItem("broadcast", JSON.stringify(msg));
    messageInput.value = "";
    messageInput.focus();
}
sendButton.addEventListener("click", enviar);
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
        enviar();
});
window.addEventListener("storage", (e) => {
    if (e.key !== "inbox") {
        return;
    }
    if (e.newValue === null) {
        return;
    }
    const msg = JSON.parse(e.newValue);
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
obrirFinestresTancades();
export {};
//# sourceMappingURL=admin.js.map