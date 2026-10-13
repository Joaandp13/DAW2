<?php
// Mostrar errores de PHP para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once __DIR__.'/../Model/mail.model.php';

$errors = [];
$missing = [];
$success = false;

// Comprobar que la petición venga por POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom = trim($_POST['nom'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $text = trim($_POST['text'] ?? '');
    $asunto =trim($_POST['asunto'] ?? '');
    $send =($_POST['sendmail']);
    // Validaciones
    if ($nom === '') {
        $errors[] = 'nom';
    }

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'email';
    }

    if ($text === '' && $send) {
        $errors[] = 'text';
    }

    if($asunto ==='' && $send){
        $errors[] = 'asumpte';
    }
    

    
    
    // Si todo es correcto, intentamos enviar el correo
    if (empty($errors)) {
        send_mail();
    }
} else {
    // Si entran directamente por URL, redirigir al formulario
    header('Location: ../index.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <title>Respuesta envio</title>
</head>
<body>

<?php if ($success): ?>
    <h1>Enviat correctament.</h1>
    <p><a href="../index.php">Tornar al formulari</a></p>
<?php else: ?>
    <h2>S'han trobat errors en l'enviament:</h2>
    <ul>
        <?php foreach ($errors as $error): ?>
            <li>Falta o és incorrecte el camp: <?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
        <?php endforeach; ?>
    </ul>
    <p><a href="../index.php">Tornar al formulari</a></p>
<?php endif; ?>

</body>
</html>