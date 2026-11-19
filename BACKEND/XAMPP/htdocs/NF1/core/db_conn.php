<?php
// Classe que crea i retorna la connexió PDO a la BDD
class Database
{
    // Connexió compartida (només es crea una vegada)
    private static ?PDO $connexio = null;

    public static function getConnexio(): PDO
    {
        if (self::$connexio === null) {
            // Crida a la BDD amb el format que demana l'enunciat
            self::$connexio = new PDO('mysql:host=localhost;dbname=backend_joan_diaz;charset=utf8mb4', 'root', '');

            // Mostrar errors com a excepcions i retornar arrays associatius
            self::$connexio->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$connexio->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            self::$connexio->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        }
        return self::$connexio;
    }
}