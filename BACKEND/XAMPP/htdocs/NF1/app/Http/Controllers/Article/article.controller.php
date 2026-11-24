<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Controlador de les operacions d'escriptura de builds.
 * Només accepta POST d'usuaris autenticats i comprova la propietat a la BDD.
 * Valida els 4 personatges (diferents, existents i amb imatge) abans de desar.
 * Després de l'operació redirigeix (PRG) per evitar reenviaments.
 */
require_once __DIR__ . '/../../../Core/auth.php';
require_once __DIR__ . '/../../../Core/validacio.php';
require_once __DIR__ . '/../../../Core/format.php';
require_once __DIR__ . '/../../../Models/article.model.php';
require_once __DIR__ . '/../../../Models/personatge.model.php';

iniciarSessio();

$usuariId = idUsuariActual();
if ($usuariId === null) {
    posarFlash('error', 'Has d\'iniciar sessió per gestionar builds.');
    header('Location: /login');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /');
    exit;
}

$errors = [];
$missatge = '';
$action = textNet($_POST['action'] ?? null);
$id = 0;
$dades = [
    'titol'   => textNet($_POST['titol'] ?? null),
    'cos'     => textNet($_POST['cos'] ?? null),
    'reaccio' => textNet($_POST['reaccio'] ?? null),
    'rol'     => textNet($_POST['rol'] ?? null),
    'dps'     => filter_var($_POST['dps'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 0]]),
];
$personatgeIds = [];

if (!in_array($action, ['insert', 'update', 'delete'], true)) {
    $errors[] = 'L\'acció indicada no és vàlida.';
}

if ($action === 'update' || $action === 'delete') {
    $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);
    if ($id === false || $id < 1) {
        $errors[] = 'L\'identificador ha de ser un enter positiu.';
        $id = 0;
    }
}

if ($action === 'insert' || $action === 'update') {
    // Dades bàsiques del build.
    if ($dades['titol'] === '' || mb_strlen($dades['titol'], 'UTF-8') > 50) {
        $errors[] = 'El títol és obligatori i no pot superar els 50 caràcters.';
    }
    if ($dades['cos'] === '') {
        $errors[] = 'La descripció del build és obligatòria.';
    }
    if ($dades['reaccio'] === '' || mb_strlen($dades['reaccio'], 'UTF-8') > 50) {
        $errors[] = 'La reacció és obligatòria i no pot superar els 50 caràcters.';
    }
    if (!in_array($dades['rol'], rolsPermesos(), true)) {
        $errors[] = 'Selecciona un rol vàlid.';
    }
    if ($dades['dps'] === false) {
        $errors[] = 'El DPS ha de ser un número enter positiu.';
        $dades['dps'] = 0;
    }

    // Exactament 4 personatges, diferents, existents i amb imatge.
    $entrada = $_POST['personatges'] ?? [];
    if (!is_array($entrada)) {
        $entrada = [];
    }
    foreach ($entrada as $valor) {
        $personatgeId = filter_var($valor, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if ($personatgeId !== false) {
            $personatgeIds[] = (int) $personatgeId;
        }
    }

    if (count($personatgeIds) !== 4) {
        $errors[] = 'Has de triar exactament 4 personatges.';
    } elseif (count(array_unique($personatgeIds)) !== 4) {
        $errors[] = 'Els 4 personatges han de ser diferents.';
    } else {
        $catalog = (new Personatge())->cercarPerIds($personatgeIds);
        if (count($catalog) !== 4) {
            $errors[] = 'Algun dels personatges triats no existeix.';
        } else {
            foreach ($personatgeIds as $personatgeId) {
                $personatge = $catalog[$personatgeId];
                if (trim((string) $personatge['imatge']) === '') {
                    $errors[] = 'El personatge ' . $personatge['nom'] . ' no té imatge i no es pot publicar.';
                }
            }
        }
    }
}

if ($errors === []) {
    try {
        $model = new Article();

        if ($action === 'insert') {
            $idNou = $model->insertarNouArticle($dades, $personatgeIds, $usuariId);
            posarFlash('ok', 'Build publicat correctament.');
            header('Location: /build?id=' . $idNou);
            exit;
        }

        if ($action === 'update') {
            $actualitzat = $model->modificarPerId($id, $dades, $personatgeIds, $usuariId);
            if ($actualitzat) {
                posarFlash('ok', 'Build modificat correctament.');
                header('Location: /build?id=' . $id);
                exit;
            }
            $errors[] = 'No s\'ha trobat el build o no ets el seu autor.';
        } elseif ($action === 'delete') {
            $esborrat = $model->esborrarPerId($id, $usuariId);
            if ($esborrat) {
                posarFlash('ok', 'Build esborrat correctament.');
                header('Location: /');
                exit;
            }
            $errors[] = 'No s\'ha trobat el build o no ets el seu autor.';
        }
    } catch (PDOException $error) {
        error_log('Error de base de dades en la gestió de builds: ' . $error->getMessage());
        $errors[] = 'No s\'ha pogut completar l\'operació amb la base de dades.';
    }
}

// Errors: conservem les dades del formulari i tornem al formulari.
if ($errors !== []) {
    $_SESSION['build_old'] = [
        'titol'       => $dades['titol'],
        'cos'         => $dades['cos'],
        'reaccio'     => $dades['reaccio'],
        'rol'         => $dades['rol'],
        'dps'         => $dades['dps'] === false ? '' : (string) $dades['dps'],
        'personatges' => $personatgeIds,
    ];
    posarFlash('error', implode(' ', $errors));
}

$desti = $action === 'update' && $id > 0 ? '/build-form?id=' . $id : '/build-form';
header('Location: ' . $desti);
exit;
