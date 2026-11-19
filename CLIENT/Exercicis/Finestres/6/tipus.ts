// Tipus compartits entre la finestra pare i la finestra filla de l'exercici 6.

export type MissatgePareAFill =
  | { tipus: "text"; text: string }
  | { tipus: "peticio-mides" }
  | { tipus: "tancar" };

export type MissatgeFillAPare =
  | { tipus: "text"; text: string }
  | { tipus: "mides"; amplada: number; alcada: number; exterior: string };

export type Missatge = MissatgePareAFill | MissatgeFillAPare;

// Type guard: valida el missatge que arriba per postMessage abans de fer-lo servir.
export function esMissatge(dada: unknown): dada is Missatge {
  if (typeof dada !== "object" || dada === null) {
    return false;
  }

  const valor = dada as { tipus?: unknown };
  return (
    valor.tipus === "text" ||
    valor.tipus === "peticio-mides" ||
    valor.tipus === "tancar" ||
    valor.tipus === "mides"
  );
}
