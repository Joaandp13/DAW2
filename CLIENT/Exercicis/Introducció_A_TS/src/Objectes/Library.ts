/**
 * Mètodes genèrics per buscar objectes dins d'un array.
 * T = tipus dels objectes de l'array
 * K = nom d'un atribut que existeix realment a T
 */

// 1. Primer objecte amb un valor concret en un atribut
export function getObjectByValue<T extends object, K extends keyof T>(
  array: T[],
  atribut: K,
  valor: T[K]
): T | undefined {
  return array.find((obj) => obj[atribut] === valor);
}

// 2. Tots els objectes amb un valor concret en un atribut
export function getObjectsByValue<T extends object, K extends keyof T>(
  array: T[],
  atribut: K,
  valor: T[K]
): T[] {
  return array.filter((obj) => obj[atribut] === valor);
}

// 3. Tots els objectes que compleixen un patró (? = una lletra, * = conjunt de lletres)
export function getObjectsByPattern<T extends object, K extends keyof T>(
  array: T[],
  atribut: K,
  patro: string
): T[] {
  // Escapem els caràcters especials de regex, excepte ? i *
  const escapat = patro.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  // Convertim els comodins a regex
  const regexText = escapat.replace(/\?/g, ".").replace(/\*/g, ".*");
  const regex = new RegExp(`^${regexText}$`);

  return array.filter((obj) => {
    const valor = obj[atribut];
    return typeof valor === "string" && regex.test(valor);
  });
}

// 4. Tots els objectes amb un atribut numèric dins d'un rang (inclusiu)
export function getObjectsInRange<T extends object, K extends keyof T>(
  array: T[],
  atribut: K,
  valorMin: number,
  valorMax: number
): T[] {
  return array.filter((obj) => {
    const valor = obj[atribut];
    return typeof valor === "number" && valor >= valorMin && valor <= valorMax;
  });
}

// ---------- Exemple d'ús ----------
interface Persona {
  nom: string;
  edat: number;
  ciutat: string;
}

const persones: Persona[] = [
  { nom: "Anna", edat: 25, ciutat: "Barcelona" },
  { nom: "Arnau", edat: 32, ciutat: "Girona" },
  { nom: "Marta", edat: 41, ciutat: "Barcelona" },
  { nom: "Pau", edat: 19, ciutat: "Lleida" },
];

console.log(getObjectByValue(persones, "ciutat", "Barcelona")); // Anna
console.log(getObjectsByValue(persones, "ciutat", "Barcelona")); // Anna, Marta
console.log(getObjectsByPattern(persones, "nom", "A*")); // Anna, Arnau
console.log(getObjectsByPattern(persones, "nom", "?au")); // Pau
console.log(getObjectsInRange(persones, "edat", 20, 35)); // Anna, Arnau