import { MediaControlBar } from "./MediaControlBar.js";

const fileInput = document.getElementById("mediaFile");
const playerContainer = document.getElementById("mediaPlayer");
const controlsContainer = document.getElementById("mediaControls");
const status = document.getElementById("mediaStatus");

if (
    !(fileInput instanceof HTMLInputElement) ||
    !(playerContainer instanceof HTMLElement) ||
    !(controlsContainer instanceof HTMLElement) ||
    !(status instanceof HTMLElement)
) {
    throw new Error("No s'han trobat els elements de la demostració multimèdia.");
}

const mediaPlayerContainer = playerContainer;
const mediaControlsContainer = controlsContainer;
const mediaStatus = status;
let currentObjectUrl: string | null = null;

/**
 * Carrega un fitxer d'àudio o vídeo i activa la seva barra de controls.
 */
fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (file === undefined) {
        return;
    }
    if (!file.type.startsWith("audio/") && !file.type.startsWith("video/")) {
        mediaStatus.textContent = "Selecciona un fitxer d'àudio o vídeo vàlid.";
        return;
    }

    if (currentObjectUrl !== null) {
        URL.revokeObjectURL(currentObjectUrl);
    }

    mediaPlayerContainer.replaceChildren();
    mediaControlsContainer.replaceChildren();
    currentObjectUrl = URL.createObjectURL(file);
    const mediaElement = document.createElement(file.type.startsWith("video/") ? "video" : "audio");
    mediaElement.controls = true;
    mediaElement.preload = "metadata";
    mediaElement.src = currentObjectUrl;
    if (mediaElement instanceof HTMLVideoElement) {
        mediaElement.width = 640;
        mediaElement.style.maxWidth = "100%";
    }
    mediaPlayerContainer.appendChild(mediaElement);
    mediaElement.load();
    const controlBar = new MediaControlBar(mediaElement, mediaControlsContainer);
    controlBar.setEnabled(true);
    mediaStatus.textContent = `Fitxer carregat: ${file.name}`;
});

/**
 * Allibera l'adreça temporal del fitxer quan es tanca o es recarrega la pàgina.
 */
window.addEventListener("beforeunload", () => {
    if (currentObjectUrl !== null) {
        URL.revokeObjectURL(currentObjectUrl);
    }
});
