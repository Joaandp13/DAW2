export interface MissatgeVot {
    type: "vote";
    idSessio: string;
    idFinestra: string;
    idPeticio: string;
    dni: string;
    idOpcio: string;
    nomOpcio: string;
}

export interface MissatgePreparat {
    type: "ready";
    idSessio: string;
    opcions: { id: string; nom: string }[];
}

export interface RespostaVot {
    type: "vote-result";
    idSessio: string;
    idFinestra: string;
    idPeticio: string;
    acceptat: boolean;
}