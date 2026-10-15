<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulari</title>
    <link rel="stylesheet" href="view/styles/style.css">
</head>

<body>

    <form action="Controller/check.php" method="post">
        <label for="nom">Nom:</label>
        <input type="text" id="nom" name="nom" >
        <br><br>

        <label for="email">Adreça de correu:</label>
        <input type="email" id="email" name="email" >
        <br><br>
        
        <label for="asunto">Asunto:</label>
        <input type="text" id="asunto" name="asunto">
        <br><br>

        <label for="sendmail">Enviar Correu?</label>
        <input type="checkbox" id="sendmail" name="sendmail" value="1">
        <br><br>

        <label for="text">Text:</label>
        <textarea id="text" name="text" required></textarea>
        <br><br>

        <button type="submit">Enviar</button>
        <button type="reset">Neteja</button>
    </form>

    <script>
        const sendCheckbox = document.getElementById('sendmail');
        const subjectField = document.getElementById('asunto');
        const textField = document.getElementById('text')
        function updateSubjectRequirement() {
            subjectField.required = sendCheckbox.checked;
            textField.required = sendCheckbox.checked;
        }

        sendCheckbox.addEventListener('change', updateSubjectRequirement);
        updateSubjectRequirement();
    </script>
</body>
</html>