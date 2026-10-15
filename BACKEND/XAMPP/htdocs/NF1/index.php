<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Articles</title>
  <link rel="icon" href="img/skull.svg" type="image/svg+xml">
  <link rel="stylesheet" href="view/styles/style.css">
</head>
<body>
  <h1>Articles GI</h1>
  <form>
    <label for="article">Introdueix l'id del article:</label>
    <input type="number" id="article" name="article">
    <label for="titol">Introdueix el títol de l'article:</label>
    <input type="text" id="titol" name="titol">
    <label for="cos">Introdueix el cos de l'article:</label>
    <input type="text" id="cos" name="cos">
    <button type="submit">Cercar per id</button>
    <button type="submit">Cercar per títol</button>
    <button type="submit">Esborrar per id</button>
    <button type="button" onclick="window.location.href='view/Article/insertarArticle.php'">Insertar nou article</button>
  </form>
</body>
</html>