import { exercici, obtenir } from "../comu/ui.js";
import * as P from "./Paraules.js";
import * as N from "./Numeros.js";
exercici("ex1", P.ex1);
exercici("ex2", P.ex2);
exercici("ex3", P.ex3);
exercici("ex4", P.ex4);
exercici("ex5", P.ex5);
exercici("ex6", P.ex6);
exercici("ex7", (out) => {
    const patro = obtenir("patro").value;
    const trobades = P.cercarPerPatro(patro);
    out(trobades.length ? trobades.join("\n") : "Cap paraula encaixa amb el patró");
});
exercici("ex8", N.ex8);
exercici("ex9", N.ex9);
exercici("ex10", N.ex10);
exercici("ex11", N.ex11);
//# sourceMappingURL=Llistes.js.map