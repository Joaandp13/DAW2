export function esMissatge(dada) {
    if (typeof dada !== "object" || dada === null) {
        return false;
    }
    const valor = dada;
    return (valor.tipus === "text" ||
        valor.tipus === "peticio-mides" ||
        valor.tipus === "tancar" ||
        valor.tipus === "mides");
}
//# sourceMappingURL=tipus.js.map