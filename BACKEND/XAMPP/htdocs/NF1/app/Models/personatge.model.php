<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Model del catàleg de personatges. Un personatge es pot reutilitzar en
 * quants builds calgui; la relació amb posició 1..4 viu a article_personatge.
 */
require_once __DIR__ . '/../Core/db_conn.php';

class Personatge
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnexio();
    }

    /** Tot el catàleg, ordenat per nom (el fa servir la pantalla d'administració). */
    public function llistarTots(): array
    {
        return $this->db->query(
            'SELECT id, id_externo, nom, imatge, element, rareza, arma
             FROM personatges ORDER BY nom'
        )->fetchAll();
    }

    /**
     * Personatges que es poden triar en un build: han de tenir imatge,
     * perquè la publicació d'un build amb un recuadre buit està bloquejada.
     */
    public function llistarSeleccionables(): array
    {
        return $this->db->query(
            "SELECT id, id_externo, nom, imatge, element, rareza, arma
             FROM personatges
             WHERE imatge IS NOT NULL AND imatge <> ''
             ORDER BY nom"
        )->fetchAll();
    }

    /** Cerca un personatge pel seu id intern. */
    public function cercarPerId(int $id): array|false
    {
        $stmt = $this->db->prepare(
            'SELECT id, id_externo, nom, imatge, element, rareza, arma
             FROM personatges WHERE id = :id'
        );
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    /**
     * Retorna els personatges dels ids indicats, indexats pel seu id.
     * Serveix per validar els 4 personatges d'un build abans de desar-lo.
     */
    public function cercarPerIds(array $ids): array
    {
        $ids = array_values(array_unique(array_map('intval', $ids)));
        if ($ids === []) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $this->db->prepare(
            "SELECT id, id_externo, nom, imatge, element, rareza, arma
             FROM personatges WHERE id IN ($placeholders)"
        );
        $stmt->execute($ids);

        $resultat = [];
        foreach ($stmt->fetchAll() as $personatge) {
            $resultat[(int) $personatge['id']] = $personatge;
        }
        return $resultat;
    }

    /** Comprova si un personatge encara apareix en algun build. */
    public function esEnUs(int $id): bool
    {
        $stmt = $this->db->prepare('SELECT 1 FROM article_personatge WHERE personatge_id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        return $stmt->fetchColumn() !== false;
    }

    /** Insereix un personatge i retorna el seu id intern. */
    public function inserir(array $dades): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO personatges (id_externo, nom, imatge, element, rareza, arma)
             VALUES (:id_externo, :nom, :imatge, :element, :rareza, :arma)'
        );
        $stmt->execute($this->parametres($dades));
        return (int) $this->db->lastInsertId();
    }

    /** Modifica un personatge existent. */
    public function modificar(int $id, array $dades): bool
    {
        $parametres = $this->parametres($dades);
        $parametres['id'] = $id;

        $stmt = $this->db->prepare(
            'UPDATE personatges
             SET id_externo = :id_externo, nom = :nom, imatge = :imatge,
                 element = :element, rareza = :rareza, arma = :arma
             WHERE id = :id'
        );
        $stmt->execute($parametres);
        return $stmt->rowCount() > 0;
    }

    /** Esborra un personatge del catàleg. La FK ho impedeix si està en ús. */
    public function esborrar(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM personatges WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }

    /** Paràmetres normals per a les sentències d'inserció i modificació. */
    private function parametres(array $dades): array
    {
        return [
            'id_externo' => $dades['id_externo'],
            'nom'        => $dades['nom'],
            'imatge'     => $dades['imatge'] !== '' ? $dades['imatge'] : null,
            'element'    => $dades['element'],
            'rareza'     => $dades['rareza'],
            'arma'       => $dades['arma'],
        ];
    }
}
