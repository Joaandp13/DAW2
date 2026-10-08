// ⚠ ARXIU DE SUBSTITUCIÓ (placeholder).
// Posa aquí el teu aes.js real (el que dona el professor): ha de definir un objecte global AES
// amb els mètodes AES.encrypt(w) i AES.decrypt(codi). Aquesta versió NO és xifrat de debò:
// només codifica en Base64 perquè el programa de l'espia funcioni mentrestant.
var AES = {
    encrypt: function (w) {
        return btoa(String.fromCharCode.apply(null, Array.from(new TextEncoder().encode(w))));
    },
    decrypt: function (codi) {
        var bytes = Uint8Array.from(atob(codi), function (c) { return c.charCodeAt(0); });
        return new TextDecoder("utf-8", { fatal: true }).decode(bytes); // llença una excepció si no és vàlid
    }
};
