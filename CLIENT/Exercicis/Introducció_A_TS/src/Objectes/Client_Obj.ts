interface Client {
    nom: string;
    edat: number;
    localitat: string;

}

const clients:Client[] = [
    {nom:"Joan",edat:18,localitat:"Palafolls"},
    {nom:"Raul",edat:18,localitat:"SantaSusanna"},
    {nom:"Gabriel",edat:18,localitat:"Malgrat"}
]
console.log("NOM----EDAT----LOCALITAT")
console.table(clients)



/*
CLAUDE VERSION

interface Client {
  id: number;
  nom: string;
  cognoms: string;
  email: string;
  telefon: string;
  edat: number;
  adreca: string;
  localitat: string;
  codiPostal: string;
}

const clients: Client[] = [
  { id: 1, nom: "Joan", cognoms: "Garcia Puig", email: "joan@mail.com", telefon: "611111111", edat: 18, adreca: "C/ Major 1", localitat: "Palafolls", codiPostal: "08389" },
  { id: 2, nom: "Raul", cognoms: "Soler Vila", email: "raul@mail.com", telefon: "622222222", edat: 18, adreca: "C/ Mar 5", localitat: "Santa Susanna", codiPostal: "08398" },
  { id: 3, nom: "Gabriel", cognoms: "Ferrer Roca", email: "gabriel@mail.com", telefon: "633333333", edat: 18, adreca: "C/ Nova 9", localitat: "Malgrat", codiPostal: "08380" },
];

// Opció 1: taula alineada feta a mà
function mostrarClients(llista: Client[]): void {
  const columnes: (keyof Client)[] = ["id", "nom", "cognoms", "email", "edat", "localitat"];

  // Amplada de cada columna = el text més llarg (capçalera o dades)
  const amples = columnes.map((c) =>
    Math.max(c.length, ...llista.map((cl) => String(cl[c]).length))
  );

  const fila = (valors: string[]) =>
    valors.map((v, i) => v.padEnd(amples[i])).join(" | ");

  console.log(fila(columnes.map((c) => c.toUpperCase())));
  console.log(amples.map((a) => "-".repeat(a)).join("-+-"));
  llista.forEach((cl) => console.log(fila(columnes.map((c) => String(cl[c])))));
}

mostrarClients(clients);

// Opció 2: console.table ja ho fa tot
console.table(clients);



*/