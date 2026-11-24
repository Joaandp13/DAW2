<?php
require_once __DIR__ . '/../../config/mail_params.php';



use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Cargar librerías de PHPMailer
require_once __DIR__ . '/../Libs/phpMailer/src/Exception.php';
require_once __DIR__ . '/../Libs/phpMailer/src/PHPMailer.php';
require_once __DIR__ . '/../Libs/phpMailer/src/SMTP.php';

function send_mail(): ?string
{
    try {
        $mail = new PHPMailer(true);
        $email = htmlspecialchars($_POST['email'] ?? '', ENT_QUOTES, 'UTF-8');
        $asunto = htmlspecialchars($_POST['asunto'] ?? '', ENT_QUOTES, 'UTF-8');
        $nom = htmlspecialchars($_POST['nom'] ?? '', ENT_QUOTES, 'UTF-8');
        $text = htmlspecialchars($_POST['text'] ?? '', ENT_QUOTES, 'UTF-8');

        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = SMTP_PORT;

        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ];

        $mail->setFrom(SMTP_USER, 'Joaandp');
        $mail->addAddress($email, $nom);
        $mail->Subject = $asunto;
        $mail->Body    = $text;
        $mail->send();
        return null;
    } catch (Exception $e) {
        return $e->getMessage();
    }
}

/**
 * Joan Diaz - Pràctica 04
 * Envia l'enllaç de recuperació de contrasenya mitjançant PHPMailer.
 * Retorna null si s'ha enviat o el missatge d'error en cas contrari.
 */
function enviarCorreuRecuperacio(string $email, string $token): ?string
{
    try {
        $mail = new PHPMailer(true);

        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = SMTP_PORT;
        $mail->CharSet    = 'UTF-8';

        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ];

        $appUrl = rtrim((string) ($_ENV['APP_URL'] ?? getenv('APP_URL') ?: 'http://nf1.local'), '/');
        $enllaç = $appUrl . '/recuperar?token=' . urlencode($token);

        $mail->setFrom(SMTP_USER, 'Archons Posts');
        $mail->addAddress($email);
        $mail->Subject = 'Recuperació de contrasenya - Archons Posts';
        $mail->Body = "Has demanat restablir la contrasenya.\n\n"
            . "Obre aquest enllaç per definir-ne una de nova (vàlid durant 1 hora):\n"
            . $enllaç . "\n\n"
            . "Si no has estat tu, ignora aquest correu.";
        $mail->send();
        return null;
    } catch (Exception $e) {
        return $e->getMessage();
    }
}