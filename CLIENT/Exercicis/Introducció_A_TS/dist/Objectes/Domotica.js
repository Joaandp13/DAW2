export function crearDomotica(missatge) {
    const sensors = [
        { nom: "pluja", valor: false },
        { nom: "termometre", valor: 22 },
        { nom: "presencia", valor: [false, false, false] },
    ];
    const persianes = {
        nom: "persianes",
        baixades: false,
        pujar() { if (this.baixades) {
            missatge("Pujant persianes...");
            this.baixades = false;
        } },
        baixar() { if (!this.baixades) {
            missatge("Baixant persianes...");
            this.baixades = true;
        } },
    };
    const termostat = {
        nom: "termostat",
        estat: 0,
        calefaccio() { if (this.estat !== 1) {
            missatge("Calefacció encesa");
            this.estat = 1;
        } },
        condicionat() { if (this.estat !== -1) {
            missatge("Aire condicionat encés");
            this.estat = -1;
        } },
        apagar() { if (this.estat !== 0) {
            missatge("Termostat apagat");
            this.estat = 0;
        } },
    };
    const llums = {
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
    function buscarSensor(nom) {
        const s = sensors.find((x) => x.nom === nom);
        if (!s)
            throw new Error("Sensor desconegut: " + nom);
        return s;
    }
    function buscarActuador(nom) {
        const a = actuadors.find((x) => x.nom === nom);
        if (!a)
            throw new Error("Actuador desconegut: " + nom);
        return a;
    }
    function programa() {
        if (buscarSensor("pluja").valor)
            buscarActuador("persianes").baixar();
        else
            buscarActuador("persianes").pujar();
        const temp = buscarSensor("termometre").valor;
        const t = buscarActuador("termostat");
        if (temp < 20)
            t.calefaccio();
        else if (temp > 25)
            t.condicionat();
        else
            t.apagar();
        buscarActuador("llums").actualitzar(buscarSensor("presencia").valor);
    }
    return { sensors, actuadors, buscarSensor, buscarActuador, programa };
}
//# sourceMappingURL=Domotica.js.map