<?php
require_once __DIR__ . '/mail_params.php';

$errors = [];
$success = false;
$nom = $email = $text = '';


?>
<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulari</title>
    <link rel="stylesheet" href="view/style.css">
</head>
<body>
    

    <?php
    $action = empty($errors) ? 'Controller/check.php' : '';
    ?>
    <form action="<?php echo $action; ?>" method="post">
        <label for="nom">Nom:</label>
        <input type="text" id="nom" name="nom"><?php if(!isset($_POST['nom'])) $errors['nom']?>
        <br><br>

        <label for="email">Adreça de correu:</label>
        <input type="email" id="email" name="email"><?php if(!isset($_POST['email'])) $errors['email']?>
        <br><br>

        <label for="text">Text:</label>
        <textarea id="text" name="text"?></textarea><?php if(!isset($_POST['text'])) $errors['text']?>
        <br><br>

        <button type="submit">Enviar</button>
        <button type="reset">Neteja</button>
        <?php 
         if(!empty($errors))
            foreach($errors as $error){
                echo '<p>Falta el camp '.$error.'.</p>';
            }
        ?>
    </form>
</body>
</html>