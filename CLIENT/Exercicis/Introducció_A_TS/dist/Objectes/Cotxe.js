const base = {
    llumExterior: 100, tunel: false, pluja: false, semafor: "cap", corba: false,
    combustible: 80, limitVia: 90, velocitatDavant: null, obstacle: false,
};
export const escenaris = [
    { nom: "Carretera, de dia", sensors: { ...base } },
    { nom: "Nit amb pluja", sensors: { ...base, llumExterior: 5, pluja: true } },
    { nom: "Túnel i vehicle de davant lent", sensors: { ...base, tunel: true, velocitatDavant: 60 } },
    { nom: "Semàfor en vermell", sensors: { ...base, semafor: "vermell", limitVia: 50 } },
    { nom: "Corba amb poca benzina", sensors: { ...base, corba: true, combustible: 8 } },
    { nom: "Obstacle a la via", sensors: { ...base, obstacle: true } },
];
export function programaCotxe(s) {
    const accions = [];
    if (s.obstacle)
        return ["FRE D'EMERGÈNCIA activat", "Llums d'emergència encesos"];
    accions.push(s.tunel || s.llumExterior < 30 ? "Llums encesos" : "Llums apagats");
    if (s.pluja)
        accions.push("Limpiaparabrises activats");
    let velocitat = s.limitVia;
    if (s.pluja)
        velocitat = Math.min(velocitat, 80);
    if (s.velocitatDavant !== null)
        velocitat = Math.min(velocitat, s.velocitatDavant);
    if (s.corba)
        velocitat = Math.min(velocitat, 40);
    if (s.semafor === "vermell")
        velocitat = 0;
    else if (s.semafor === "groc")
        velocitat = Math.min(velocitat, 30);
    accions.push(velocitat === 0 ? "Aturar-se (semàfor en vermell)" : `Velocitat objectiu: ${velocitat} km/h`);
    if (s.corba)
        accions.push("Girar: activar intermitent i direcció");
    if (s.combustible < 10)
        accions.push("Combustible baix: localitzar la benzinera més propera");
    return accions;
}
//# sourceMappingURL=Cotxe.js.map