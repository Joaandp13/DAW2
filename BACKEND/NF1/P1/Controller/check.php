<?php
require_once __DIR__ . '/../mail_params.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'phpMailer/src/SMTP.php';
require 'phpMailer/src/PHPMailer.php';
require 'phpMailer/src/Exception.php';

$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom = trim($_POST['nom'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $text = trim($_POST['text'] ?? '');

    if ($nom === '') {
        $errors[] = 'Falta el camp: nom';
    }

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'L\'email no és vàlid';
    }

    if ($text === '') {
        $errors[] = 'Falta el camp: text';
    }

    if (empty($errors)) {
        
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = SMTP_USER;
            $mail->Password = SMTP_PASS;
            $mail->SMTPSecure = 'tls'; 
            $mail->Port = 587;

            $mail->setFrom(SMTP_USER, 'Joaandp');
            $mail->addAddress($email, $nom);
            $mail->Subject = 'TEST FORM';
            $mail->Body = "Nom: $nom\n\n$text";

            $mail->send();
            $success = true;
        } catch (Exception $e) {
            $errors[] = 'Mail error: ' . $mail->ErrorInfo;
        }
    }
}

if ($success) {
    echo '<h1>Enviat correctament.</h1>';
    echo '<p><a href="../index.php">Tornar al formulari</a></p>';
} elseif (!empty($errors)) {
    echo '<ul>';
    foreach ($errors as $error) {
        echo '<li>' . htmlspecialchars($error, ENT_QUOTES, 'UTF-8') . '</li>';
    }
    echo '</ul>';
    echo '<p><a href="../index.php">Tornar al formulari</a></p>';
}
