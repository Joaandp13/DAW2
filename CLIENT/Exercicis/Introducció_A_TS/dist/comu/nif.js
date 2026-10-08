const LLETRES_NIF = "TRWAGMYFPDXBNJZSQVHLCKE";
export function lletraNIF(numero) {
    return LLETRES_NIF[numero % 23];
}
export function nifValid(nif) {
    const m = /^(\d{8})([A-Za-z])$/.exec(nif.trim());
    if (!m)
        return false;
    return lletraNIF(parseInt(m[1], 10)) === m[2].toUpperCase();
}
//# sourceMappingURL=nif.js.map