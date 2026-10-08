// OBJECTES V2 - ex.1: mètodes genèrics per cercar objectes dins d'un array.
// Són genèrics (<T extends object>): serveixen per a qualsevol tipus d'objecte.

type Registre = Record<string, unknown>;

/** Llegeix un atribut pel seu nom (retorna undefined si l'objecte no el té). */
function llegir(obj: object, atribut: string): unknown {
    return atribut in obj ? (obj as Registre)[atribut] : undefined;
}

/** Primer objecte que té `valor` a l'atribut (o undefined). */
export function getObjectByValue<T extends object>(array: T[], atribut: string, valor: unknown): T | undefined {
    return array.find((obj) => atribut in obj && llegir(obj, atribut) === valor);
}

/** Tots els objectes que tenen `valor` a l'atribut. */
export function getObjectsByValue<T extends object>(array: T[], atribut: string, valor: unknown): T[] {
    return array.filter((obj) => atribut in obj && llegir(obj, atribut) === valor);
}

/** Tots els objectes on l'atribut (text) conté el patró. ? = una lletra, * = un conjunt de lletres. */
export function getObjectsByPattern<T extends object>(array: T[], atribut: string, patro: string): T[] {
    const escapat = patro.replace(/[.+^${}()|[\]\\]/g, "\\$&"); // escapa els caràcters especials de RegExp
    const regex = new RegExp(escapat.replaceAll("?", ".").replaceAll("*", ".*"), "i");
    return array.filter((obj) => {
        const v = llegir(obj, atribut);
        return typeof v === "string" && regex.test(v);
    });
}

/** Tots els objectes on l'atribut numèric està entre valorMin i valorMax (tots dos inclosos). */
export function getObjectsInRange<T extends object>(array: T[], atribut: string, valorMin: number, valorMax: number): T[] {
    return array.filter((obj) => {
        const v = llegir(obj, atribut);
        return typeof v === "number" && v >= valorMin && v <= valorMax;
    });
}
