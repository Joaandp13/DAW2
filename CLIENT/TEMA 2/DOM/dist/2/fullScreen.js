const app = document.getElementById("app");
const fullscreenButton = document.getElementById("fullscreenButton");
if (!(app instanceof HTMLElement) || !(fullscreenButton instanceof HTMLButtonElement)) {
    throw new Error("No s'han trobat els elements de pantalla completa.");
}
const appElement = app;
const buttonElement = fullscreenButton;
function updateFullscreenButton() {
    const isFullscreen = document.fullscreenElement === appElement;
    buttonElement.textContent = isFullscreen ? "▣" : "⛶";
    buttonElement.setAttribute("aria-label", isFullscreen ? "Surt de la pantalla completa" : "Activa la pantalla completa");
    buttonElement.title = isFullscreen ? "Surt de la pantalla completa" : "Pantalla completa";
}
async function toggleFullscreen() {
    if (document.fullscreenElement === appElement) {
        await document.exitFullscreen();
    }
    else {
        await appElement.requestFullscreen();
    }
}
buttonElement.addEventListener("click", () => {
    toggleFullscreen().catch(error => {
        console.error("No s'ha pogut canviar el mode de pantalla completa.", error);
    });
});
document.addEventListener("fullscreenchange", updateFullscreenButton);
updateFullscreenButton();
export {};
//# sourceMappingURL=fullScreen.js.map