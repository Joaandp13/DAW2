-- Joan Diaz - Pràctica 04
-- Migració per a una base de dades backend_joan_diaz ja importada.
-- Si encara no tens la BDD, importa directament backend_joan_diaz.sql.
--
-- La migració és idempotent: es pot executar diverses vegades. Serveix tant
-- per a una BDD amb només autenticació com per a una de ja migrada.

USE `backend_joan_diaz`;

-- 1) Autenticació ( les columnes ja existeixen si vas importar la BDD
--    després de la pràctica de login: IF NOT EXISTS evita errors).
ALTER TABLE `usuaris`
  ADD COLUMN IF NOT EXISTS `remember_token` varchar(64) DEFAULT NULL AFTER `admin`,
  ADD COLUMN IF NOT EXISTS `reset_token` varchar(64) DEFAULT NULL AFTER `remember_token`,
  ADD COLUMN IF NOT EXISTS `reset_expiry` datetime DEFAULT NULL AFTER `reset_token`,
  ADD UNIQUE KEY IF NOT EXISTS `usuaris_usermail_uniq` (`usermail`),
  ADD UNIQUE KEY IF NOT EXISTS `usuaris_username_uniq` (`username`);

-- 2) Propietat i camps nous del build. Primer nullable perquè la taula pot
--    contenir articles antics; al final es posen NOT NULL.
ALTER TABLE `articles`
  ADD COLUMN IF NOT EXISTS `usuari_id` int(11) DEFAULT NULL AFTER `cos`,
  ADD COLUMN IF NOT EXISTS `reaccio` varchar(50) DEFAULT NULL AFTER `usuari_id`,
  ADD COLUMN IF NOT EXISTS `rol` enum('main-dps','sub-dps','support') DEFAULT NULL AFTER `reaccio`,
  ADD COLUMN IF NOT EXISTS `dps` int(11) NOT NULL DEFAULT 0 AFTER `rol`,
  ADD COLUMN IF NOT EXISTS `vistas` int(11) NOT NULL DEFAULT 0 AFTER `dps`,
  ADD COLUMN IF NOT EXISTS `likes` int(11) NOT NULL DEFAULT 0 AFTER `vistas`,
  ADD COLUMN IF NOT EXISTS `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `likes`,
  ADD KEY IF NOT EXISTS `articles_usuari_id_idx` (`usuari_id`);

-- La clau aliena s'afegeix amb SQL dinàmic perquè MariaDB no accepta
-- ADD CONSTRAINT IF NOT EXISTS per a FOREIGN KEY.
SET @nf1_sql = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE `articles` ADD CONSTRAINT `articles_usuari_fk` FOREIGN KEY (`usuari_id`) REFERENCES `usuaris` (`id`) ON DELETE SET NULL ON UPDATE CASCADE',
    'SELECT 1')
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'articles'
    AND CONSTRAINT_NAME = 'articles_usuari_fk'
);
PREPARE nf1_stmt FROM @nf1_sql;
EXECUTE nf1_stmt;
DEALLOCATE PREPARE nf1_stmt;

-- 3) Catàleg de personatges i relació amb els builds.
CREATE TABLE IF NOT EXISTS `personatges` (
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

CREATE TABLE IF NOT EXISTS `article_personatge` (
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

-- 4) Els articles antics no tenen 4 personatges assignats: s'esborren.
DELETE FROM `articles`
WHERE (SELECT COUNT(*) FROM `article_personatge` `ap` WHERE `ap`.`article_id` = `articles`.`id`) <> 4;

-- 5) Ara que no queden articles antics, els camps obligatoris poden ser NOT NULL.
ALTER TABLE `articles`
  MODIFY COLUMN `reaccio` varchar(50) NOT NULL,
  MODIFY COLUMN `rol` enum('main-dps','sub-dps','support') NOT NULL;
