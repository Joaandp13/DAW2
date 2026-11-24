<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Model d'usuaris: consultes PDO relatives a autenticació i registre.
 * Totes les consultes amb dades de l'usuari utilitzen sentències preparades.
 */
require_once __DIR__ . '/../Core/db_conn.php';

class Users
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnexio();
    }

    /**
     * Cerca un usuari pel seu correu o pel seu nom visible.
     * S'utilitza al login, on el camp accepta qualsevol dels dos valors.
     */
    public function buscarPerIdentificador(string $identificador): array|false
    {
        // Amb ATTR_EMULATE_PREPARES = false, cada placeholder ha de ser únic:
        // reutilitzar :identificador dues vegades donaria SQLSTATE HY093.
        $stmt = $this->db->prepare(
            'SELECT id, usermail, username, password, admin
             FROM usuaris
             WHERE usermail = :usermail OR username = :username
             LIMIT 1'
        );
        $stmt->execute([
            'usermail' => $identificador,
            'username' => $identificador,
        ]);
        return $stmt->fetch();
    }

    /** Cerca un usuari pel correu (per comprovar duplicats en el registre). */
    public function buscarPerEmail(string $email): array|false
    {
        $stmt = $this->db->prepare('SELECT id FROM usuaris WHERE usermail = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        return $stmt->fetch();
    }

    /** Cerca un usuari pel nom visible (per comprovar duplicats en el registre). */
    public function buscarPerUsername(string $username): array|false
    {
        $stmt = $this->db->prepare('SELECT id FROM usuaris WHERE username = :username LIMIT 1');
        $stmt->execute(['username' => $username]);
        return $stmt->fetch();
    }

    /**
     * Registra un usuari nou amb la contrasenya ja encriptada.
     * El camp de la BDD es diu `usermail` (no `email`).
     */
    public function register_user(string $username, string $email, string $passwordHash): bool
    {
        $stmt = $this->db->prepare(
            'INSERT INTO usuaris (usermail, username, password, admin)
             VALUES (:mail, :user, :password, 0)'
        );
        $stmt->execute([
            'mail' => $email,
            'user' => $username,
            'password' => $passwordHash,
        ]);
        return $stmt->rowCount() > 0;
    }

    /** Desa el hash del token de la cookie "Recorda'm". */
    public function desarTokenRecordatori(int $id, string $tokenHash): bool
    {
        $stmt = $this->db->prepare('UPDATE usuaris SET remember_token = :token WHERE id = :id');
        $stmt->execute(['token' => $tokenHash, 'id' => $id]);
        return $stmt->rowCount() > 0;
    }

    /** Valida el token de la cookie contra l'usuari indicat. */
    public function buscarPerTokenRecordatori(string $token, int $id): array|false
    {
        $stmt = $this->db->prepare(
            'SELECT id, username, admin FROM usuaris
             WHERE id = :id AND remember_token = :token LIMIT 1'
        );
        $stmt->execute(['id' => $id, 'token' => hash('sha256', $token)]);
        return $stmt->fetch();
    }

    /** Elimina el token de recordatori (en tancar sessió). */
    public function esborrarTokenRecordatori(int $id): bool
    {
        $stmt = $this->db->prepare('UPDATE usuaris SET remember_token = NULL WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }

    /** Desa el hash del token de recuperació amb una caducitat d'una hora. */
    public function desarTokenRecuperacio(int $id, string $tokenHash): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE usuaris
             SET reset_token = :token, reset_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR)
             WHERE id = :id'
        );
        $stmt->execute(['token' => $tokenHash, 'id' => $id]);
        return $stmt->rowCount() > 0;
    }

    /** Cerca un token de recuperació que encara sigui vigent. */
    public function buscarPerTokenRecuperacio(string $token): array|false
    {
        $stmt = $this->db->prepare(
            'SELECT id, usermail FROM usuaris
             WHERE reset_token = :token AND reset_expiry > NOW() LIMIT 1'
        );
        $stmt->execute(['token' => hash('sha256', $token)]);
        return $stmt->fetch();
    }

    /** Actualitza la contrasenya i invalida el token de recuperació. */
    public function actualitzarContrasenya(int $id, string $passwordHash): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE usuaris
             SET password = :password, reset_token = NULL, reset_expiry = NULL
             WHERE id = :id'
        );
        $stmt->execute(['password' => $passwordHash, 'id' => $id]);
        return $stmt->rowCount() > 0;
    }

    /** Busca un usuario por proveedor OAuth y UID del proveedor. */
    public function buscarPerOAuth(string $provider, string $providerUid): array|false
    {
        $stmt = $this->db->prepare(
            'SELECT id, usermail, username, admin
        FROM usuaris
        WHERE oauth_provider = :provider AND oauth_uid = :uid
        LIMIT 1'
        );
        $stmt->execute(['provider' => $provider, 'uid' => $providerUid]);
        return $stmt->fetch();
    }

    /** Crea un usuario procedente de OAuth (sin contraseña local). */
    public function registrarOAuth(string $email, string $username, string $provider, string $providerUid): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO usuaris (usermail, username, password, admin, oauth_provider, oauth_uid)
         VALUES (:usermail, :username, NULL, 0, :provider, :uid)'
        );
        $stmt->execute([
            'usermail' => $email,
            'username' => $username,
            'provider' => $provider,
            'uid' => $providerUid,
        ]);
        return (int) $this->db->lastInsertId();
    }

    /** Vincula una cuenta OAuth a un usuario existente. */
    public function vincularOAuth(int $id, string $provider, string $providerUid): void
    {
        $stmt = $this->db->prepare(
            'UPDATE usuaris
         SET oauth_provider = :provider, oauth_uid = :uid
         WHERE id = :id'
        );
        $stmt->execute(['provider' => $provider, 'uid' => $providerUid, 'id' => $id]);
    }


}


