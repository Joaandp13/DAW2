<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Formulari d'inserció d'articles. És un parcial inclòs per la vista de
 * paginació només quan hi ha un usuari autenticat.
 */
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    header('Location: /');
    exit;
}
?>
<section class="new-article" aria-labelledby="new-article-title">
  <h2 id="new-article-title">Nou article</h2>
  <form method="post" action="/">
    <input type="hidden" name="action" value="insert">
    <label for="titol-nou">Títol:</label>
    <input type="text" id="titol-nou" name="titol" maxlength="50" required>
    <label for="cos-nou">Cos:</label>
    <textarea id="cos-nou" name="cos" required></textarea>
    <button type="submit">Publicar article</button>
  </form>
</section>
