<?php
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    header('Location: ../testForm.php');
    exit;
}

require_once __DIR__ . '/../Model/mail.model.php';

$errors = [];
$successMessage = null;
$nom = isset($_POST['nom']) && is_string($_POST['nom']) ? trim($_POST['nom']) : '';
$email = isset($_POST['email']) && is_string($_POST['email']) ? trim($_POST['email']) : '';
$asunto = isset($_POST['asunto']) && is_string($_POST['asunto']) ? trim($_POST['asunto']) : '';
$text = isset($_POST['text']) && is_string($_POST['text']) ? trim($_POST['text']) : '';
$sendMail = isset($_POST['sendmail']);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    if ($nom === '') {
        $errors[] = 'Falta o és incorrecte el camp: nom';
    }

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Falta o és incorrecte el camp: email';
    }

    if ($text === '' && $sendMail) {
        $errors[] = 'Falta o és incorrecte el camp: text';
    }

    if ($asunto === '' && $sendMail) {
        $errors[] = 'Falta o és incorrecte el camp: asumpte';
    }

    if ($errors === []) {
        if ($sendMail) {
            $mailError = send_mail();
            if ($mailError === null) {
                $successMessage = 'Enviat correctament.';
            } else {
                $errors[] = "No s'ha pogut enviar el correu: $mailError";
            }
        } else {
            $successMessage = 'Validació correcta.';
        }
    }
}
