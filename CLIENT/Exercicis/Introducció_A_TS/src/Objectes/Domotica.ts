// OBJECTES V2 - ex.6: casa domòtica (sensors, actuadors i programa controlador)

export interface Sensors { pluja: boolean; termometre: number; presencia: boolean[]; }
export interface Sensor<T> { nom: string; valor: T; }
type QualsevolSensor = Sensor<boolean> | Sensor<number> | Sensor<boolean[]>;

export interface Persianes { nom: "persianes"; baixades: boolean; pujar(): void; baixar(): void; }
export interface Termostat { nom: "termostat"; estat: -1 | 0 | 1; calefaccio(): void; condicionat(): void; apagar(): void; }
export interface Llums { nom: "llums"; encesos: boolean[]; habitacions: string[]; actualitzar(valors: boolean[]): void; }
export interface Actuadors { persianes: Persianes; termostat: Termostat; llums: Llums; }

/** Crea la casa domòtica. `missatge` és la funció que mostra els avisos dels actuadors. */
export function crearDomotica(missatge: (m: string) => void) {
    const sensors: QualsevolSensor[] = [
        { nom: "pluja", valor: false },
        { nom: "termometre", valor: 22 },
        { nom: "presencia", valor: [false, false, false] },
    ];

    const persianes: Persianes = {
        nom: "persianes",
        baixades: false,
        pujar() { if (this.baixades) { missatge("Pujant persianes..."); this.baixades = false; } },
        baixar() { if (!this.baixades) { missatge("Baixant persianes..."); this.baixades = true; } },
    };
    const termostat: Termostat = {
        nom: "termostat",
        estat: 0,
        calefaccio() { if (this.estat !== 1) { missatge("Calefacció encesa"); this.estat = 1; } },
        condicionat() { if (this.estat !== -1) { missatge("Aire condicionat encés"); this.estat = -1; } },
        apagar() { if (this.estat !== 0) { missatge("Termostat apagat"); this.estat = 0; } },
    };
    const llums: Llums = {
        nom: "llums",
        encesos: [false, false, false],
        habitacions: ["Menjador", "Lavabo", "Dormitori"],
        actualitzar(valors) {
            this.encesos.forEach((encesa, i) => {
                if (valors[i] !== encesa) {
                    missatge(`Llum ${this.habitacions[i]} ${valors[i] ? "encesa" : "apagada"}`);
                    this.encesos[i] = valors[i];
                }
            });
        },
    };
    const actuadors = [persianes, termostat, llums];

    // Funcions auxiliars: busquen pel nom i el tipus es dedueix de la clau (K)
    function buscarSensor<K extends keyof Sensors>(nom: K): Sensor<Sensors[K]> {
        const s = sensors.find((x) => x.nom === nom);
        if (!s) throw new Error("Sensor desconegut: " + nom);
        return s as unknown as Sensor<Sensors[K]>;
    }
    function buscarActuador<K extends keyof Actuadors>(nom: K): Actuadors[K] {
        const a = actuadors.find((x) => x.nom === nom);
        if (!a) throw new Error("Actuador desconegut: " + nom);
        return a as unknown as Actuadors[K];
    }

    /** Programa controlador: llegeix els sensors i ordena als actuadors. */
    function programa(): void {
        if (buscarSensor("pluja").valor) buscarActuador("persianes").baixar();
        else buscarActuador("persianes").pujar();

        const temp = buscarSensor("termometre").valor;
        const t = buscarActuador("termostat");
        if (temp < 20) t.calefaccio();
        else if (temp > 25) t.condicionat();
        else t.apagar();

        buscarActuador("llums").actualitzar(buscarSensor("presencia").valor);
    }

    return { sensors, actuadors, buscarSensor, buscarActuador, programa };
}
