<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Pantalla d'administració del catàleg de personatges. Només hi pot accedir
 * un usuari amb sessió i admin = 1. Serveix per donar d'alta personatges i
 * les seves rutes d'imatge abans de poder publicar builds.
 *
 * Les escriptures fan PRG: després de POST redirigeixen a /personatges.
 */
require_once __DIR__ . '/../../../Core/auth.php';
require_once __DIR__ . '/../../../Core/validacio.php';
require_once __DIR__ . '/../../../Core/format.php';
require_once __DIR__ . '/../../../Models/personatge.model.php';

iniciarSessio();

if (!esAdminActual()) {
    posarFlash('error', 'Només un administrador pot gestionar el catàleg de personatges.');
    header('Location: /');
    exit;
}

$model = new Personatge();
$errors = [];
$missatge = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = textNet($_POST['action'] ?? null);

    if (!in_array($action, ['insert', 'update', 'delete'], true)) {
        $errors[] = 'L\'acció indicada no és vàlida.';
    }

    $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);

    if (($action === 'update' || $action === 'delete') && $id === false) {
        $errors[] = 'L\'identificador del personatge no és vàlid.';
    }

    if ($action === 'delete' && $id !== false && $errors === []) {
        if ($model->esEnUs((int) $id)) {
            $errors[] = 'Aquest personatge encara apareix en algun build i no es pot esborrar.';
        } elseif ($model->esborrar((int) $id)) {
            $missatge = 'Personatge esborrat del catàleg.';
        } else {
            $errors[] = 'No s\'ha pogut esborrar el personatge.';
        }
    }

    if ($action === 'insert' || $action === 'update') {
        $dades = [
            'id_externo' => textNet($_POST['id_externo'] ?? null),
            'nom'        => textNet($_POST['nom'] ?? null),
            'imatge'     => textNet($_POST['imatge'] ?? null),
            'element'    => textNet($_POST['element'] ?? null),
            'rareza'     => filter_var($_POST['rareza'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 99]]),
            'arma'       => textNet($_POST['arma'] ?? null),
        ];

        if (preg_match('/^[a-z0-9]+(?:_[a-z0-9]+)*$/', $dades['id_externo']) !== 1) {
            $errors[] = 'L\'id extern ha de ser un slug en minúscules amb guions baixos (p. ex. raiden_shogun).';
        }
        if ($dades['nom'] === '' || mb_strlen($dades['nom'], 'UTF-8') > 100) {
            $errors[] = 'El nom del personatge és obligatori (màxim 100 caràcters).';
        }
        if (mb_strlen($dades['imatge'], 'UTF-8') > 255) {
            $errors[] = 'La ruta de la imatge no pot superar els 255 caràcters.';
        }
        if (!in_array($dades['element'], elementsPermesos(), true)) {
            $errors[] = 'Selecciona un element vàlid.';
        }
        if ($dades['rareza'] === false) {
            $errors[] = 'La rareza ha de ser un número enter (per exemple, 4 o 5).';
            $dades['rareza'] = 0;
        }
        if (!in_array($dades['arma'], armesPermeses(), true)) {
            $errors[] = 'Selecciona una arma vàlida.';
        }

        // Si s'ha triat un fitxer, la pujada substitueix la ruta escrita a mà.
        // Només es mou el fitxer si la resta de dades són correctes.
        $fitxerDesat = null;
        if ($errors === []) {
            $fitxer = $_FILES['imatge_file'] ?? null;

            if (is_array($fitxer) && (int) ($fitxer['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
                $errorPujada = (int) ($fitxer['error'] ?? UPLOAD_ERR_OK);

                if ($errorPujada !== UPLOAD_ERR_OK) {
                    $errors[] = $errorPujada === UPLOAD_ERR_INI_SIZE || $errorPujada === UPLOAD_ERR_FORM_SIZE
                        ? 'La imatge supera el límit de 2 MB del servidor.'
                        : 'No s\'ha pogut pujar la imatge. Torna-ho a provar.';
                } elseif ((int) ($fitxer['size'] ?? 0) > 2 * 1024 * 1024) {
                    $errors[] = 'La imatge ha de pesar com a màxim 2 MB.';
                } else {
                    $info = @getimagesize((string) $fitxer['tmp_name']);
                    $tipus = $info[2] ?? null;

                    if (!in_array($tipus, [IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) {
                        $errors[] = 'La imatge ha de ser PNG o WebP.';
                    } else {
                        $directori = __DIR__ . '/../../img/personatges/';
                        if (!is_dir($directori) && !mkdir($directori, 0755, true)) {
                            $errors[] = 'No s\'ha pogut crear la carpeta de les imatges dels personatges.';
                        } elseif (!is_writable($directori)) {
                            $errors[] = 'La carpeta img/personatges/ no té permisos d\'escriptura.';
                        } else {
                            $extensio = $tipus === IMAGETYPE_PNG ? 'png' : 'webp';
                            $nomBase = $dades['id_externo']; // ja validat com a slug
                            $nomFitxer = $nomBase . '.' . $extensio;
                            $sufix = 1;

                            while (file_exists($directori . $nomFitxer)) {
                                $nomFitxer = $nomBase . '_' . $sufix . '.' . $extensio;
                                $sufix++;
                            }

                            if (move_uploaded_file((string) $fitxer['tmp_name'], $directori . $nomFitxer)) {
                                $dades['imatge'] = 'img/personatges/' . $nomFitxer;
                                $fitxerDesat = $directori . $nomFitxer;
                            } else {
                                $errors[] = 'No s\'ha pogut desar la imatge al servidor.';
                            }
                        }
                    }
                }
            }
        }

        if ($errors === []) {
            try {
                if ($action === 'insert') {
                    $model->inserir($dades);
                    $missatge = 'Personatge afegit al catàleg.';
                } elseif ($model->modificar((int) $id, $dades)) {
                    $missatge = 'Personatge actualitzat.';
                } else {
                    if ($fitxerDesat !== null && is_file($fitxerDesat)) {
                        @unlink($fitxerDesat);
                    }
                    $errors[] = 'No s\'ha trobat el personatge.';
                }
            } catch (PDOException $error) {
                if ($fitxerDesat !== null && is_file($fitxerDesat)) {
                    @unlink($fitxerDesat);
                }
                error_log('Error en el catàleg de personatges: ' . $error->getMessage());
                $errors[] = 'Ja existeix un personatge amb aquest id extern o no s\'ha pogut desar.';
            }
        }
    }

    if ($errors !== []) {
        posarFlash('error', implode(' ', $errors));
    } elseif ($missatge !== '') {
        posarFlash('ok', $missatge);
    }

    header('Location: /personatges');
    exit;
}

// GET: id del personatge a editar (0 = formulari d'alta).
$idEditar = filter_var($_GET['edit'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if ($idEditar === false) {
    $idEditar = 0;
}

$personatges = $model->llistarTots();

require __DIR__ . '/../../../../resources/views/Admin/personatges.php';
