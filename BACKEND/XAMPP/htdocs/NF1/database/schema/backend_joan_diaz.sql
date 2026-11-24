-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-11-2026
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12
--
-- Joan Diaz - Pràctica 04
-- Esquema complet: autenticació, catàleg de personatges i builds de 4 personatges.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `backend_joan_diaz`
--
CREATE DATABASE IF NOT EXISTS `backend_joan_diaz` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `backend_joan_diaz`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuaris`
--
-- `remember_token` guarda el hash del token de la cookie "Recorda'm".
-- `reset_token` / `reset_expiry` gestionen la recuperació de contrasenya.
--
CREATE TABLE `usuaris` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usermail` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT 0,
  `remember_token` varchar(64) DEFAULT NULL,
  `reset_token` varchar(64) DEFAULT NULL,
  `reset_expiry` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuaris_usermail_uniq` (`usermail`),
  UNIQUE KEY `usuaris_username_uniq` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personatges`
--
-- Catàleg reutilitzable. `id` és l'identificador intern de la BDD i
-- `id_externo` és l'identificador del joc (slug amb guions baixos).
-- `imatge` és la ruta al retrat dins d'img/personatges/. Un personatge sense
-- imatge no es pot triar en un build (la publicació es bloqueja).
--
CREATE TABLE `personatges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_externo` varchar(50) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `imatge` varchar(255) DEFAULT NULL,
  `element` enum('anemo','cryo','dendro','electro','geo','hydro','pyro') NOT NULL,
  `rareza` tinyint unsigned NOT NULL,
  `arma` enum('Sword','Claymore','Polearm','Bow','Catalyst') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personatges_id_externo_uniq` (`id_externo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articles`
--
-- Cada article és un build amb exactament 4 personatges (vegeu
-- `article_personatge`). L'element de la targeta NO s'emmagatzema aquí:
-- es dedueix del personatge de la posició 1 ("main" del build).
-- `vistas` s'incrementa en obrir la fitxa i `likes` reflecteix els likes per usuari (taula article_likes).
--
CREATE TABLE `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titol` varchar(50) DEFAULT NULL,
  `cos` text DEFAULT NULL,
  `usuari_id` int(11) DEFAULT NULL,
  `reaccio` varchar(50) NOT NULL,
  `rol` enum('main-dps','sub-dps','support') NOT NULL,
  `dps` int(11) NOT NULL DEFAULT 0,
  `vistas` int(11) NOT NULL DEFAULT 0,
  `likes` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `articles_usuari_id_idx` (`usuari_id`),
  CONSTRAINT `articles_usuari_fk` FOREIGN KEY (`usuari_id`) REFERENCES `usuaris` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `article_personatge`
--
-- Relació N:M entre builds i personatges. `posicio` va de 1 a 4 i és única
-- per build; la clau (article_id, personatge_id) evita personatges repetits.
--
CREATE TABLE `article_personatge` (
  `article_id` int(11) NOT NULL,
  `personatge_id` int(11) NOT NULL,
  `posicio` tinyint unsigned NOT NULL,
  PRIMARY KEY (`article_id`,`posicio`),
  UNIQUE KEY `article_personatge_personatge_uniq` (`article_id`,`personatge_id`),
  KEY `article_personatge_personatge_idx` (`personatge_id`),
  CONSTRAINT `article_personatge_article_fk` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `article_personatge_personatge_fk` FOREIGN KEY (`personatge_id`) REFERENCES `personatges` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `article_personatge_posicio_chk` CHECK (`posicio` BETWEEN 1 AND 4)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `article_likes`
--
-- Likes persistents per usuari. Un usuari només pot donar un like per build.
--
CREATE TABLE `article_likes` (
  `article_id` int(11) NOT NULL,
  `usuari_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`article_id`,`usuari_id`),
  KEY `article_likes_usuari_idx` (`usuari_id`),
  CONSTRAINT `article_likes_article_fk` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `article_likes_usuari_fk` FOREIGN KEY (`usuari_id`) REFERENCES `usuaris` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
