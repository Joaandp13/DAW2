<?php

require_once __DIR__ . '/../core/db_conn.php';

class Article
{
    private PDO $db;

    public function __construct()
    {
        $this->db = DataBase::getConnexio();
    }

    public function llistarTots()
    {
        return $this->db->query('SELECT id, titol , cos FROM articles')->fetchAll();
    }

    public function cercarPerId(int $id): array|false
    {
        $stmt = $this->db->prepare('SELECT id, nom, cos FROM articles WHERE id= :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();

    }

    public function cercarPerTitol(string $titol): array|false
    {
        $stmt = $this->db->prepare('SELECT id, titol, cos FROM articles WHERE titol= :titol');
        $stmt->execute(['titol' => $titol]);
        return $stmt->fetch();
    }

    public function esborrarPerId(int $id): array|false
    {
        $stmt = $this->db->prepare('DELETE FROM articles WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    
    public function insertarNouArticle(array $data): int
    {
        $stmt = $this->db->prepare('INSERT INTO articles (titol, cos) VALUES (:titol, :cos)');
        $stmt->execute([
            'titol' => $data['titol'],
            'cos' => $data['cos'],
        ]);
        return (int) $this->db->lastInsertId();
    }

}

?>