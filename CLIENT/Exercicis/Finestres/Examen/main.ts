let start = document.getElementById('votacions') as HTMLButtonElement
let results = document.getElementById('resultats') as HTMLDivElement

let finestres: (Window | null)[] = [];
let numfinestres: number = 4;
finestres.fill(null,0,numfinestres)