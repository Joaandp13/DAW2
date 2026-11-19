<?php

setcookie('font-size', '30px', time() + 60 * 60 * 24 * 30, '/'); 

?>
<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="UTF-8">
        <title>Document</title>
</head>
<body>
        <h1>Ja tinc cookie setejada!</h1>
        <a href="text.php">anar a la pagina 2</a>
</body>
</html>

TEXT.PHP:
    
<?php 

if (isset($_COOKIE['font-size'])) {
        $mida = $_COOKIE['font-size'];
} else {
        $mida = '8px';
}


?>
<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="UTF-8">
        <title>Text</title>
        <style> 
                p {
                        font-size: <?php echo $mida; ?>;  
                }
        </style>
</head>
<body>
        <p>Oh yeah!!!</p>
</body>
</html>
