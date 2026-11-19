import { Message } from "./tipus.js";

const h2 = document.getElementById("username") as HTMLHeadingElement;
const chat = document.getElementById("chat") as HTMLTextAreaElement;
const messageInput = document.getElementById("message") as HTMLInputElement;
const sendButton = document.getElementById("send") as HTMLButtonElement;

const nom = new URLSearchParams(window.location.search).get("name") || "DefaultUser";

h2.textContent = nom;
document.title = nom;

window.addEventListener("storage", (e) => {
    if (e.key !== "broadcast") {
        return;

    }
    if (e.newValue === null) {
        return;
    }
    const msg = JSON.parse(e.newValue) as Message
    if (msg.type === "clear") chat.value = "";
    if (msg.type === "message") {
        const newline = `${msg.user}: ${msg.text}`
        if (chat.value !== "") {
            chat.value = newline + "\n" + chat.value;
        } else {
            chat.value = newline;
        }
    }

})

function enviar() {
    if (messageInput.value.trim() === "") {
        return;
    }

    const msg: Message = {
        id: Date.now(),
        user: nom,
        text: messageInput.value.trim(),
        type: "message"
    }
    localStorage.setItem("inbox", JSON.stringify(msg))
    messageInput.value = "";
    messageInput.focus();

}

sendButton.addEventListener("click", enviar);

