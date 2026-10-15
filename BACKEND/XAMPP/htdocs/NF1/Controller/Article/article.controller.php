


<?php

require_once __DIR__ . '/../../Model/article.model.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Method not allowed.');
}

$errors = [];
$action = $_POST['action'] ?? null;

if (!is_string($action) || !in_array($action, ['insert', 'consult'], true)) {
    $errors[] = 'L’acció ha de ser insert o consult.';
} elseif ($action === 'insert') {
    $titol = $_POST['titol'] ?? null;
    $cos = $_POST['cos'] ?? null;

    if (!is_string($titol)) {
        $errors[] = 'El títol ha de ser un text.';
    } else {
        $titol = trim(strip_tags($titol));
        $titleLength = mb_strlen($titol, 'UTF-8');

        if ($titleLength < 1 || $titleLength > 50) {
            $errors[] = 'El títol ha de tenir entre 1 i 50 caràcters.';
        }
    }

    if (!is_string($cos)) {
        $errors[] = 'El cos de l’article ha de ser un text.';
    } else {
        $cos = trim(strip_tags($cos));
    }
} elseif ($action === 'consult') {
    $id = $_POST['id'] ?? null;
    $titol = $_POST['titol'] ?? null;

    if (($id === null) === ($titol === null)) {
        $errors[] = 'Indica un identificador o un títol per consultar l’article.';
    } elseif ($id !== null) {
        if (!is_string($id) || filter_var($id, FILTER_VALIDATE_INT) === false || (int) $id < 1) {
            $errors[] = 'L’identificador ha de ser un enter positiu.';
        }
    } else {
        if (!is_string($titol)) {
            $errors[] = 'El títol ha de ser un text.';
        } else {
            $titol = trim(strip_tags($titol));
            $titleLength = mb_strlen($titol, 'UTF-8');

            if ($titleLength < 1 || $titleLength > 50) {
                $errors[] = 'El títol ha de tenir entre 1 i 50 caràcters.';
            }
        }
    }
}

if ($errors !== []) {
    http_response_code(400);
    echo '<h1>La sol·licitud no és vàlida</h1><ul>';
    foreach ($errors as $error) {
        echo '<li>' . htmlspecialchars($error, ENT_QUOTES, 'UTF-8') . '</li>';
    }
    echo '</ul><a href="../../view/Article/insertarArticle.php">Tornar</a>';
    exit;
}

if ($errors == []){
    if($action === 'insert'){
        $article = new Article();
        $result = $article->insertarNouArticle(['titol' => $titol, 'cos' => $cos]);
        if ($result === 0) {
            http_response_code(500);
            echo '<h1>Error en la sol·licitud</h1><p>No s’ha pogut insertar l’article.</p><a href="../../view/Article/insertarArticle.php">Tornar</a>';
            exit;
        }
        else{
            echo '<h1>Article inserit correctament</h1><p>L’article amb id ' . htmlspecialchars($result, ENT_QUOTES, 'UTF-8') . ' s’ha inserit correctament.</p><a href="../../view/Article/insertarArticle.php">Tornar</a>';
        }
    }
}

?>