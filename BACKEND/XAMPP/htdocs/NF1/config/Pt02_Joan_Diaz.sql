CREATE DATABASE IF NOT EXISTS `backend_joan_diaz`;
USE `backend_joan_diaz`;

CREATE TABLE articles(
    id INT PRIMARY KEY AUTO_INCREMENT,
    titol VARCHAR(50),
    cos TEXT
);

CREATE TABLE usuaris(
    id INT PRIMARY KEY AUTO_INCREMENT,
    email varchar(255),
    username varchar(255),
    nom VARCHAR(50),
    cognom1 VARCHAR(50),
    cognom2 VARCHAR(50),
    password varchar(255),
    admin boolean
);