const app = document.getElementById("app");
const fullscreenButton = document.getElementById("fullscreenButton");

if (!(app instanceof HTMLElement) || !(fullscreenButton instanceof HTMLButtonElement)) {
    throw new Error("No s'han trobat els elements de pantalla completa.");
}

const appElement = app;
const buttonElement = fullscreenButton;

/**
 * Actualitza la icona i l'etiqueta del botó segons l'estat actual.
 */
function updateFullscreenButton(): void {
    const isFullscreen = document.fullscreenElement === appElement;
    buttonElement.textContent = isFullscreen ? "▣" : "⛶";
    buttonElement.setAttribute(
        "aria-label",
        isFullscreen ? "Surt de la pantalla completa" : "Activa la pantalla completa"
    );
    buttonElement.title = isFullscreen ? "Surt de la pantalla completa" : "Pantalla completa";
}

/**
 * Activa o desactiva la pantalla completa del panell.
 */
async function toggleFullscreen(): Promise<void> {
    if (document.fullscreenElement === appElement) {
        await document.exitFullscreen();
    } else {
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
