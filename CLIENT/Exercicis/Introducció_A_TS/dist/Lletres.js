"use strict";
function transliterar(f) {
    return f
        .normalize("NFD")
        .replace(/(?<=[aeiouAEIOU])[\u0300-\u036f]/g, "");
}
function separar(f, sep) {
    const separadorsValids = [',', '.', '-', '/', ';', ':', '_', '(', ')', '"', "'"];
    if (!sep || !separadorsValids.includes(sep)) {
        alert("El separador no pot estar buit i ha de ser un caràcter vàlid");
    }
    const trossos = f.split(sep);
    const trossosNum = trossos.length;
    const formattedText = trossos.join("\n");
    return `${trossosNum} trossos:\n${formattedText}`;
}
export {};
//# sourceMappingURL=Lletres.js.map