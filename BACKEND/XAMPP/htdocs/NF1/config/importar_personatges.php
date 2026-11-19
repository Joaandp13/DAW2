<?php
/**
 * Script d'importació del catàleg de personatges (icones rodones).
 *
 * - Llegeix els noms d'arxiu dels *Round icon*.png de img/personatges/character-icons/
 *   (NO extreu el ZIP; les imatges ja han d'estar extretes).
 * - Completa element, rareza i arma des de genshin_characters_v1.csv (mateixa carpeta).
 * - Personatges amb imatge però sense fila al CSV: s'insereixen amb dades neutres
 *   (element anemo, rareza 5, arma Sword) per poder editar-los després a l'admin.
 * - Travelers: crea 10 files (Aether/Lumine x anemo,dendro,electro,geo,hydro),
 *   totes amb arma Sword; cada una usa la imatge rodona d'Aether o de Lumine.
 * - id_externo = slug del nom; nom = nom original. imatge = ruta relativa.
 * - Reexecució segura: omet els id_externo que ja existeixen (no duplica ni modifica).
 *
 * IMPORTANT: NO EXECUTAR fins que se t'indiqui explícitament.
 * Ús (CLI):  php config/importar_personatges.php
 * Ús (web):  obrir /NF1/config/importar_personatges.php al navegador
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    header('Content-Type: text/plain; charset=UTF-8');
}

require_once __DIR__ . '/../core/db_conn.php';

$csvPath = __DIR__ . '/genshin_characters_v1.csv';
$imgDir  = __DIR__ . '/../img/personatges/character-icons';
$imgRel  = 'img/personatges/character-icons';

function slug(string $name): string
{
    $s = mb_strtolower($name, 'UTF-8');
    $s = preg_replace('/[^a-z0-9]+/u', '_', $s);
    return trim((string) $s, '_');
}

function out(string $msg): void
{
    echo $msg . PHP_EOL;
}

// --- Carrega CSV ---
if (!is_file($csvPath)) {
    out('ERROR: No s\'ha trobat el CSV: ' . $csvPath);
    exit(1);
}

$handle = fopen($csvPath, 'r');
if ($handle === false) {
    out('ERROR: No s\'ha pogut obrir el CSV.');
    exit(1);
}

$headers = fgetcsv($handle);
if ($headers === false) {
    out('ERROR: CSV buit o invàlid.');
    exit(1);
}
// Treu BOM UTF-8 de la primera capçalera si hi és
$headers[0] = preg_replace('/^\xEF\xBB\xBF/', '', (string) $headers[0]);
$idx = array_flip($headers);

$requiredCols = ['character_name', 'star_rarity', 'vision', 'weapon_type'];
foreach ($requiredCols as $col) {
    if (!isset($idx[$col])) {
        out('ERROR: Falta la columna "' . $col . '" al CSV.');
        exit(1);
    }
}

$csvData = [];
while (($row = fgetcsv($handle)) !== false) {
    if (count($row) < count($headers)) {
        continue;
    }
    $name = $row[$idx['character_name']];
    if ($name === null || $name === '') {
        continue;
    }
    $csvData[$name] = [
        'element' => strtolower(trim((string) $row[$idx['vision']])),
        'rareza'  => (int) $row[$idx['star_rarity']],
        'arma'    => trim((string) $row[$idx['weapon_type']]),
    ];
}
fclose($handle);

// --- Escaneja imatges rodones ---
if (!is_dir($imgDir)) {
    out('ERROR: No s\'ha trobat la carpeta d\'imatges: ' . $imgDir);
    exit(1);
}

$imageMap = []; // nom del personatge (segons fitxer) => ruta relativa
$files = scandir($imgDir);
if ($files === false) {
    out('ERROR: No s\'ha pogut llegir la carpeta d\'imatges.');
    exit(1);
}
foreach ($files as $file) {
    if (strpos($file, 'Round icon') === false || !str_ends_with($file, '.png')) {
        continue;
    }
    $parts = explode(' · ', $file);
    $name = $parts[0] ?? '';
    if ($name !== '') {
        $imageMap[$name] = $imgRel . '/' . $file;
    }
}

if ($imageMap === []) {
    out('ERROR: No s\'han trobat fitxers "Round icon" a ' . $imgDir);
    exit(1);
}

out('CSV carregat: ' . count($csvData) . ' files.');
out('Imatges rodones trobades: ' . count($imageMap) . '.');
out('');

// --- Construeix la llista d\'inserció ---
$entries = []; // id_externo => dades

// 1) Travelers: 10 files (Aether/Lumine x elements), arma Sword, imatge per gènere
$travelerElements = ['Anemo', 'Dendro', 'Electro', 'Geo', 'Hydro'];
$travelerGenders  = ['Aether', 'Lumine'];
foreach ($travelerGenders as $gender) {
    $imgKey = 'Traveler (' . $gender . ')';
    if (!isset($imageMap[$imgKey])) {
        out('AVÍS: No s\'ha trobat la imatge rodona de ' . $imgKey . '; es saltaran les seves variants.');
        continue;
    }
    foreach ($travelerElements as $elem) {
        $nom = 'Traveler (' . $gender . ', ' . $elem . ')';
        $idExterno = slug($nom);
        $csv = $csvData[$nom] ?? null;
        $entries[$idExterno] = [
            'id_externo' => $idExterno,
            'nom'        => $nom,
            'imatge'     => $imageMap[$imgKey],
            'element'    => strtolower($elem),
            'rareza'     => $csv ? $csv['rareza'] : 5,
            'arma'       => 'Sword',
        ];
    }
}

// 2) Resta de personatges a partir de les imatges rodones
$neutral = ['element' => 'anemo', 'rareza' => 5, 'arma' => 'Sword'];
foreach ($imageMap as $name => $path) {
    if ($name === 'Traveler (Aether)' || $name === 'Traveler (Lumine)') {
        continue; // ja tractats com a 10 variants
    }
    $idExterno = slug($name);
    if (isset($entries[$idExterno])) {
        continue;
    }
    if (isset($csvData[$name])) {
        $data = $csvData[$name];
    } else {
        $data = $neutral;
        out('AVÍS: "' . $name . '" no és al CSV -> dades neutres (anemo, 5, Sword).');
    }
    $entries[$idExterno] = [
        'id_externo' => $idExterno,
        'nom'        => $name,
        'imatge'     => $path,
        'element'    => $data['element'],
        'rareza'     => $data['rareza'],
        'arma'       => $data['arma'],
    ];
}

out('');
out('Total a processar: ' . count($entries) . ' personatges.');

// --- Inserció a la BD (omet existents) ---
try {
    $db = Database::getConnexio();
} catch (Throwable $e) {
    out('ERROR de connexió a la BD: ' . $e->getMessage());
    exit(1);
}

$check = $db->prepare('SELECT 1 FROM personatges WHERE id_externo = :id_externo LIMIT 1');
$insert = $db->prepare(
    'INSERT INTO personatges (id_externo, nom, imatge, element, rareza, arma)
     VALUES (:id_externo, :nom, :imatge, :element, :rareza, :arma)'
);

$inserted = 0;
$skipped  = 0;
$errors   = 0;

try {
    $db->beginTransaction();
    foreach ($entries as $entry) {
        $check->execute(['id_externo' => $entry['id_externo']]);
        if ($check->fetchColumn() !== false) {
            $skipped++;
            continue;
        }
        try {
            $insert->execute([
                'id_externo' => $entry['id_externo'],
                'nom'        => $entry['nom'],
                'imatge'     => $entry['imatge'],
                'element'    => $entry['element'],
                'rareza'     => $entry['rareza'],
                'arma'       => $entry['arma'],
            ]);
            $inserted++;
        } catch (PDOException $e) {
            $errors++;
            out('ERROR inserint "' . $entry['nom'] . '" (' . $entry['id_externo'] . '): ' . $e->getMessage());
        }
    }
    $db->commit();
} catch (Throwable $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    out('ERROR durant la transacció: ' . $e->getMessage());
    exit(1);
}

out('');
out('Resultat:');
out('  Inserits: ' . $inserted);
out('  Omesos (ja existien): ' . $skipped);
out('  Errors: ' . $errors);
out('');
out('Fet. Revisa el catàleg a /NF1/personatges.php (admin) per ajustar els personatges amb dades neutres.');
