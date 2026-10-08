// Punt d'entrada de Mes_funcions.html
// ex.7 - TOT el codi d'inicialització va dins d'una funció anònima autoexecutable (IIFE).
// (Els mòduls ES ja tenen el seu propi àmbit, però així es veu el patró clàssic.)
import { exercici, exerciciHtml, obtenir } from "../comu/ui.js";
import { executarNom, executarParamVars } from "./Executar.js";
import { informe, executarProves } from "./Verificar.js";
import { demoExpedients } from "./ExpedientsFuncional.js";
import { comptador } from "./Comptador.js";
import { encriptar, desencriptar, neteja, compararTemps } from "./Espia.js";

(function () {
    exercici("ex1", executarNom);
    exercici("ex2", executarParamVars);
    exercici("ex3", (out) => informe(executarProves(), out));
    exerciciHtml("ex4", demoExpedients);

    exercici("ex5", (out) => {
        const a = comptador(0, 1);
        const b = comptador(100, 10, 80, 120);
        out(`a (ini 0, inc 1):          ${a.finc()}, ${a.finc()}, ${a.finc()}, ${a.fdec()}`);
        out(`b (100, inc 10, 80..120):  ${b.finc()}, ${b.finc()}, ${b.finc()}, ${b.finc()}  <- no passa de 120`);
        out(`b.limit(90, 110):          ${b.limit(90, 110)}`);
        out(`b.limit(130, 100):         ${b.limit(130, 100)}  (límits intercanviats: 100..130)`);
        out(`b.set(105, 5):             ${b.set(105, 5)}`);
        out(`a i b són independents:    a.finc() = ${a.finc()}`);
    });

    // ex.6 - Espia (la sortida és un <pre>, l'entrada un <textarea>)
    const entrada = obtenir<HTMLTextAreaElement>("text-espia");
    const sortida = obtenir("out-ex6");
    const mostrar = (t: string): void => { sortida.textContent = t; };
    obtenir("btn-encriptar").addEventListener("click", () => mostrar(encriptar(entrada.value)));
    obtenir("btn-desencriptar").addEventListener("click", () => mostrar(desencriptar(entrada.value)));
    obtenir("btn-neteja").addEventListener("click", () => mostrar(neteja() || "(cap paraula repetida)"));
    obtenir("btn-temps").addEventListener("click", () => {
        const t = compararTemps(entrada.value || "L'encriptació i des-encriptació s'ha de fer amb caché.");
        mostrar(`Sense caché: ${t.senseCache.toFixed(2)} ms\nAmb caché:   ${t.ambCache.toFixed(2)} ms`);
    });
})();
