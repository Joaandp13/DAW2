/**
 * Passa un text a majúscules i elimina accents i dièresis.
 * La Ñ i la Ç es conserven (es protegeixen abans de normalitzar).
 */
export function transformar(text: string): string {
    return text
        .toUpperCase()
        .replaceAll("Ñ", "\u0001")
        .replaceAll("Ç", "\u0002")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replaceAll("\u0001", "Ñ")
        .replaceAll("\u0002", "Ç");
}
