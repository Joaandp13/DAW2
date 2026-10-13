<?php
require_once __DIR__ . '/../config/mail_params.php';



use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Cargar librerías de PHPMailer
require_once __DIR__ . '/../libs/phpMailer/src/Exception.php';
require_once __DIR__ . '/../libs/phpMailer/src/PHPMailer.php';
require_once __DIR__ . '/../libs/phpMailer/src/SMTP.php';

function send_mail(){
    $mail = new PHPMailer(true);
        $email = htmlspecialchars($_POST['email'] ?? '', ENT_QUOTES, 'UTF-8');
        $asunto = htmlspecialchars($_POST['asunto'] ?? '', ENT_QUOTES, 'UTF-8');
        $nom = htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8');
        $text = htmlspecialchars($_POST['text'] ?? '', ENT_QUOTES, 'UTF-8');
        try {
            $mail->isSMTP();
            $mail->Host       = SMTP_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = SMTP_USER;
            $mail->Password   = SMTP_PASS;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

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
            $success = true;
        } catch (Exception $e) {
         echo`$e`;
        }
}?>