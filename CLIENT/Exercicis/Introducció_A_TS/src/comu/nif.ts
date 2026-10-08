// Verificació de la lletra del NIF (algoritme: número mòdul 23).
const LLETRES_NIF = "TRWAGMYFPDXBNJZSQVHLCKE";

/** Retorna la lletra que correspon a un número de DNI. */
export function lletraNIF(numero: number): string {
    return LLETRES_NIF[numero % 23];
}

/** true si el NIF té 8 xifres i la lletra correcta (ex.: 12345678Z). */
export function nifValid(nif: string): boolean {
    const m = /^(\d{8})([A-Za-z])$/.exec(nif.trim());
    if (!m) return false;
    return lletraNIF(parseInt(m[1], 10)) === m[2].toUpperCase();
}
