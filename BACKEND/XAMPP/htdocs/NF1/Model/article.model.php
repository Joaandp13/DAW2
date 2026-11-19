<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Model de builds (articles). Cada build té exactament 4 personatges a la
 * taula de relació. L'element de la targeta no és un camp: es calcula a la
 * vista a partir del personatge de la posició 1.
 *
 * Les operacions d'escriptura reben l'id de l'usuari autenticat per comprovar
 * la propietat també a la BDD, no només al controlador.
 */
require_once __DIR__ . '/../core/db_conn.php';
require_once __DIR__ . '/../core/format.php';

class Article
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnexio();
    }

    /* ------------------------------------------------------------------ */
    /*Lectura                                                              */
    /* ------------------------------------------------------------------ */

    /** Construeix la clàusula WHERE compartida per comptar i llistar. */
    private function condicions(array $filtres, ?int $usuariId, array &$params): string
    {
        $where = [];

        if ($usuariId !== null) {
            $where[] = 'a.usuari_id = :usuari_id';
            $params['usuari_id'] = $usuariId;
        }
        if (($filtres['titol'] ?? '') !== '') {
            $where[] = 'a.titol LIKE :titol';
            $params['titol'] = '%' . $filtres['titol'] . '%';
        }
        if (($filtres['autor'] ?? '') !== '') {
            $where[] = 'u.username LIKE :autor';
            $params['autor'] = '%' . $filtres['autor'] . '%';
        }
        if (($filtres['reaccio'] ?? '') !== '') {
            $where[] = 'a.reaccio LIKE :reaccio';
            $params['reaccio'] = '%' . $filtres['reaccio'] . '%';
        }
        if (in_array($filtres['rol'] ?? '', rolsPermesos(), true)) {
            $where[] = 'a.rol = :rol';
            $params['rol'] = $filtres['rol'];
        }

        return $where === [] ? '' : ' WHERE ' . implode(' AND ', $where);
    }

    /** Orde de la llista segons el selector «Order». */
    private function ordre(array $filtres): string
    {
        return match ($filtres['order'] ?? 'likes') {
            'views'  => 'a.vistas DESC, a.id DESC',
            'recent' => 'a.created_at DESC, a.id DESC',
            default  => 'a.likes DESC, a.id DESC',
        };
    }

    /** Nombre de builds que compleixen els filtres (i l'autor, si escau). */
    public function comptarArticles(array $filtres, ?int $usuariId = null): int
    {
        $params = [];
        $where = $this->condicions($filtres, $usuariId, $params);

        $stmt = $this->db->prepare(
            'SELECT COUNT(*) FROM articles a LEFT JOIN usuaris u ON u.id = a.usuari_id' . $where
        );
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    /**
     * Retorna una pàgina de builds amb els seus 4 personatges ja carregats.
     * Es fan dues consultes (builds i relacions) per evitar GROUP_CONCAT i
     * mantenir l'ordre de posició 1..4 de cada build.
     */
    public function returnPage(int $limit, int $offset, array $filtres, ?int $usuariId = null): array
    {
        $params = [];
        $where = $this->condicions($filtres, $usuariId, $params);

        $sql = 'SELECT a.id, a.titol, a.cos, a.usuari_id, a.reaccio, a.rol,
                       a.dps, a.vistas, a.likes, a.created_at, u.username
                FROM articles a LEFT JOIN usuaris u ON u.id = a.usuari_id'
            . $where
            . ' ORDER BY ' . $this->ordre($filtres)
            . ' LIMIT :limit OFFSET :offset';

        $stmt = $this->db->prepare($sql);
        foreach ($params as $clau => $valor) {
            $stmt->bindValue(':' . $clau, $valor);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $articles = $stmt->fetchAll();

        return $this->afegirPersonatges($articles);
    }

    /** Cerca un build pel seu id, amb autor i 4 personatges. */
    public function cercarPerId(int $id): array|false
    {
        $stmt = $this->db->prepare(
            'SELECT a.id, a.titol, a.cos, a.usuari_id, a.reaccio, a.rol,
                    a.dps, a.vistas, a.likes, a.created_at, u.username
             FROM articles a LEFT JOIN usuaris u ON u.id = a.usuari_id
             WHERE a.id = :id'
        );
        $stmt->execute(['id' => $id]);
        $article = $stmt->fetch();

        if ($article === false) {
            return false;
        }

        $ambPersonatges = $this->afegirPersonatges([$article]);
        return $ambPersonatges[0];
    }

    /** Afegeix a cada build la llista de personatges ordenada per posició. */
    private function afegirPersonatges(array $articles): array
    {
        $ids = array_map(static fn(array $article): int => (int) $article['id'], $articles);
        if ($ids === []) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $this->db->prepare(
            'SELECT ap.article_id, ap.posicio, p.id, p.id_externo, p.nom, p.imatge,
                    p.element, p.rareza, p.arma
             FROM article_personatge ap
             INNER JOIN personatges p ON p.id = ap.personatge_id
             WHERE ap.article_id IN (' . $placeholders . ')
             ORDER BY ap.article_id, ap.posicio'
        );
        $stmt->execute($ids);

        $perBuild = [];
        foreach ($stmt->fetchAll() as $personatge) {
            $perBuild[(int) $personatge['article_id']][] = $personatge;
        }

        foreach ($articles as &$article) {
            $article['personatges'] = $perBuild[(int) $article['id']] ?? [];
            $article['element'] = $article['personatges'][0]['element'] ?? '';
        }
        unset($article);

        return $articles;
    }

    /* ------------------------------------------------------------------ */
    /*Escriptura                                                           */
    /* ------------------------------------------------------------------ */

    /** Insereix el build i les 4 relacions en una sola transacció. */
    public function insertarNouArticle(array $data, array $personatgeIds, int $usuariId): int
    {
        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare(
                'INSERT INTO articles (titol, cos, usuari_id, reaccio, rol, dps)
                 VALUES (:titol, :cos, :usuari_id, :reaccio, :rol, :dps)'
            );
            $stmt->execute([
                'titol'     => $data['titol'],
                'cos'       => $data['cos'],
                'usuari_id' => $usuariId,
                'reaccio'   => $data['reaccio'],
                'rol'       => $data['rol'],
                'dps'       => $data['dps'],
            ]);
            $id = (int) $this->db->lastInsertId();

            $this->desarPersonatges($id, $personatgeIds);
            $this->db->commit();
            return $id;
        } catch (Throwable $error) {
            $this->db->rollBack();
            throw $error;
        }
    }

    /**
     * Modifica un build i substitueix els seus 4 personatges.
     * Si es passa $usuariId, només es modifica si l'usuari n'és l'autor.
     */
    public function modificarPerId(int $id, array $data, array $personatgeIds, ?int $usuariId = null): bool
    {
        if ($usuariId !== null && !$this->esPropietari($id, $usuariId)) {
            return false;
        }

        $this->db->beginTransaction();
        try {
            $sql = 'UPDATE articles
                    SET titol = :titol, cos = :cos, reaccio = :reaccio, rol = :rol, dps = :dps
                    WHERE id = :id';
            $params = [
                'id'      => $id,
                'titol'   => $data['titol'],
                'cos'     => $data['cos'],
                'reaccio' => $data['reaccio'],
                'rol'     => $data['rol'],
                'dps'     => $data['dps'],
            ];
            $this->db->prepare($sql)->execute($params);

            $this->db->prepare('DELETE FROM article_personatge WHERE article_id = :id')->execute(['id' => $id]);
            $this->desarPersonatges($id, $personatgeIds);

            $this->db->commit();
            return true;
        } catch (Throwable $error) {
            $this->db->rollBack();
            throw $error;
        }
    }

    /** Desa les 4 posicions d'un build. Els ids ja han estat validats. */
    private function desarPersonatges(int $articleId, array $personatgeIds): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO article_personatge (article_id, personatge_id, posicio)
             VALUES (:article_id, :personatge_id, :posicio)'
        );

        foreach (array_values($personatgeIds) as $index => $personatgeId) {
            $stmt->execute([
                'article_id'    => $articleId,
                'personatge_id' => (int) $personatgeId,
                'posicio'       => $index + 1,
            ]);
        }
    }

    /** Esborra un build; la FK CASCADE esborra les 4 relacions. */
    public function esborrarPerId(int $id, ?int $usuariId = null): bool
    {
        $sql = 'DELETE FROM articles WHERE id = :id';
        $params = ['id' => $id];

        if ($usuariId !== null) {
            $sql .= ' AND usuari_id = :usuari_id';
            $params['usuari_id'] = $usuariId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    /** Comprova que un build pertany a l'usuari indicat. */
    public function esPropietari(int $id, ?int $usuariId): bool
    {
        if ($usuariId === null) {
            return false;
        }

        $stmt = $this->db->prepare('SELECT 1 FROM articles WHERE id = :id AND usuari_id = :usuari_id');
        $stmt->execute(['id' => $id, 'usuari_id' => $usuariId]);
        return $stmt->fetchColumn() !== false;
    }
}
