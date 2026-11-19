import { createElement } from "../1/docElementsFuncs.js";

/**
 * Barra de control reutilitzable per a elements d'àudio o vídeo.
 */
export class MediaControlBar {
    private readonly playButton: HTMLButtonElement;
    private readonly status: HTMLElement;
    private readonly buttons: HTMLButtonElement[];

    constructor(
        private readonly media: HTMLMediaElement,
        parent: HTMLElement
    ) {
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

    /**
     * Habilita els botons quan l'element multimèdia té una font carregada.
     */
    setEnabled(enabled: boolean): void {
        this.buttons.forEach(button => {
            button.disabled = !enabled;
        });
    }

    /**
     * Reprodueix o pausa el fitxer seleccionat.
     */
    private togglePlayback(): void {
        if (this.media.paused) {
            this.media.play().catch(error => {
                this.status.textContent = `Error de reproducció: ${error.message}`;
            });
        } else {
            this.media.pause();
        }
    }

    /**
     * Avança o retrocedeix el temps de reproducció i el manté dins dels límits.
     */
    private seek(seconds: number): void {
        const duration = Number.isFinite(this.media.duration) ? this.media.duration : Infinity;
        this.media.currentTime = Math.max(0, Math.min(duration, this.media.currentTime + seconds));
    }

    /**
     * Puja o baixa el volum en salts de deu punts percentuals.
     */
    private changeVolume(amount: number): void {
        this.media.volume = Math.max(0, Math.min(1, this.media.volume + amount));
    }

    /**
     * Actualitza el text del botó quan canvia la reproducció.
     */
    private updatePlayButton(): void {
        this.playButton.textContent = this.media.paused ? "Reprodueix" : "Pausa";
    }

    /**
     * Mostra el volum actual en forma de percentatge.
     */
    private updateVolumeStatus(): void {
        this.status.textContent = `Volum: ${Math.round(this.media.volume * 100)}%`;
    }

    /**
     * Crea un botó de la barra i hi associa la seva acció.
     */
    private createButton(
        parent: HTMLElement,
        label: string,
        action: () => void
    ): HTMLButtonElement {
        const button = createElement("button", parent, undefined, label);
        if (!(button instanceof HTMLButtonElement)) {
            throw new Error("No s'ha pogut crear un botó multimèdia.");
        }
        button.type = "button";
        button.addEventListener("click", action);
        return button;
    }
}
