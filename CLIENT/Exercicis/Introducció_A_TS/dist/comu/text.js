export function transformar(text) {
    return text
        .toUpperCase()
        .replaceAll("Ñ", "\u0001")
        .replaceAll("Ç", "\u0002")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replaceAll("\u0001", "Ñ")
        .replaceAll("\u0002", "Ç");
}
//# sourceMappingURL=text.js.map