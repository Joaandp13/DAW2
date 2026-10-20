<?php require_once __DIR__ . '/Controller/check.php'; ?>
<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulari</title>
    <link rel="stylesheet" href="view/styles/style.css">
</head>

<body>

    <form method="post">
        <label for="nom">Nom:</label>
        <input type="text" id="nom" name="nom" value="<?php echo htmlspecialchars($nom, ENT_QUOTES, 'UTF-8'); ?>">
        <br><br>

        <label for="email">Adreça de correu:</label>
        <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email, ENT_QUOTES, 'UTF-8'); ?>">
        <br><br>
        
        <label for="asunto">Asunto:</label>
        <input type="text" id="asunto" name="asunto" value="<?php echo htmlspecialchars($asunto, ENT_QUOTES, 'UTF-8'); ?>">
        <br><br>

        <label for="sendmail">Enviar Correu?</label>
        <input type="checkbox" id="sendmail" name="sendmail" value="1"<?php echo $sendMail ? ' checked' : ''; ?>>
        <br><br>

        <label for="text">Text:</label>
        <textarea id="text" name="text"><?php echo htmlspecialchars($text, ENT_QUOTES, 'UTF-8'); ?></textarea>
        <br><br>

        <button type="submit">Enviar</button>
        <button type="reset">Neteja</button>
    </form>

    <?php if ($successMessage !== null): ?>
        <p role="status"><?php echo htmlspecialchars($successMessage, ENT_QUOTES, 'UTF-8'); ?></p>
    <?php endif; ?>

    <?php if ($errors !== []): ?>
        <ul role="alert">
            <?php foreach ($errors as $error): ?>
                <li><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>
</body>
</html>