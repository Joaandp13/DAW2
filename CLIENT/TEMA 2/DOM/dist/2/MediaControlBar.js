import { createElement } from "../1/docElementsFuncs.js";
export class MediaControlBar {
    media;
    playButton;
    status;
    buttons;
    constructor(media, parent) {
        this.media = media;
        const bar = createElement("div", parent);
        if (bar === undefined) {
            throw new Error("No s'ha pogut crear la barra de controls multimèdia.");
        }
        bar.className = "media-controls";
        this.playButton = this.createButton(bar, "Reprodueix", () => this.togglePlayback());
        this.createButton(bar, "−5 s", () => this.seek(-5));
        this.createButton(bar, "+5 s", () => this.seek(5));
        this.createButton(bar, "− volum", () => this.changeVolume(-0.1));
        this.createButton(bar, "+ volum", () => this.changeVolume(0.1));
        const status = createElement("span", bar);
        if (status === undefined) {
            throw new Error("No s'ha pogut crear l'estat de la barra multimèdia.");
        }
        this.status = status;
        this.status.setAttribute("role", "status");
        this.status.textContent = `Volum: ${Math.round(media.volume * 100)}%`;
        this.buttons = Array.from(bar.querySelectorAll("button"));
        this.setEnabled(false);
        media.addEventListener("play", () => this.updatePlayButton());
        media.addEventListener("pause", () => this.updatePlayButton());
        media.addEventListener("ended", () => this.updatePlayButton());
        media.addEventListener("volumechange", () => this.updateVolumeStatus());
    }
    setEnabled(enabled) {
        this.buttons.forEach(button => {
            button.disabled = !enabled;
        });
    }
    togglePlayback() {
        if (this.media.paused) {
            this.media.play().catch(error => {
                this.status.textContent = `Error de reproducció: ${error.message}`;
            });
        }
        else {
            this.media.pause();
        }
    }
    seek(seconds) {
        const duration = Number.isFinite(this.media.duration) ? this.media.duration : Infinity;
        this.media.currentTime = Math.max(0, Math.min(duration, this.media.currentTime + seconds));
    }
    changeVolume(amount) {
        this.media.volume = Math.max(0, Math.min(1, this.media.volume + amount));
    }
    updatePlayButton() {
        this.playButton.textContent = this.media.paused ? "Reprodueix" : "Pausa";
    }
    updateVolumeStatus() {
        this.status.textContent = `Volum: ${Math.round(this.media.volume * 100)}%`;
    }
    createButton(parent, label, action) {
        const button = createElement("button", parent, undefined, label);
        if (!(button instanceof HTMLButtonElement)) {
            throw new Error("No s'ha pogut crear un botó multimèdia.");
        }
        button.type = "button";
        button.addEventListener("click", action);
        return button;
    }
}
//# sourceMappingURL=MediaControlBar.js.map