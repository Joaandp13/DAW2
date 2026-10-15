<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Articles</title>
  <link rel="icon" href="../../img/skull.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../styles/style.css">
</head>
<body>
  <h1>Articles GI</h1>
  <form id="article-form" action="/NF1/Controller/Article/article.controller.php" method="post">
    <input type="hidden" name="action" value="insert">
    <label for="titol">Introdueix el títol de l'article:</label>
    <input type="text" id="titol" name="titol">
    <label for="cos">Introdueix el cos de l'article:</label>
    <input type="text" id="cos" name="cos">
    <button type="submit" confirm="Estàs segur que vols insertar aquest article?" value="insert">Insertar article</button>
    <div id="result">       

    </div>
  </form>
  <script>
    const form = document.getElementById('article-form');
    const result = document.getElementById('result');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      try {
        const response = await fetch(form.getAttribute('action'), {
          method: form.method,
          body: new FormData(form)
        });
        result.innerHTML = await response.text();
      } catch (error) {
        result.textContent = 'No s’ha pogut contactar amb el servidor. Torna-ho a provar.';
      }
    });
  </script>
</body>
</html>