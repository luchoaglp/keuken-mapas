<?php

session_start();

if(!isset($_SESSION['user'])) {
  header('Location: ../');
  exit();
} 

?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Inicio</title>
  <link rel="shortcut icon" href="../img/keuken.ico">
  <link href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" rel="stylesheet">
  <link href="../css/bootstrap.min.css" rel="stylesheet">
  <link href="../css/mdb.min.css" rel="stylesheet">
</head>
<body>

  <nav class="navbar navbar-expand-lg navbar-dark primary-color">
    <a class="navbar-brand" href="./">Inicio</a>
  
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#maps-nav"
      aria-controls="maps-nav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
  
    <div class="collapse navbar-collapse" id="maps-nav">
  
      <ul class="navbar-nav mr-auto">
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="dropdown-seller" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Vendedor</a>
            <div class="dropdown-menu dropdown-primary" aria-labelledby="dropdown-sellerMenuLink">
                <a class="dropdown-item" href="./sellerroute.php">Ruta</a>
                <a class="dropdown-item" href="#">Seguimiento</a>
            </div>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="dropdown-enterprise" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Empresa</a>
            <div class="dropdown-menu dropdown-primary" aria-labelledby="dropdown-enterpriseMenuLink">
              <a class="dropdown-item" href="#">Seguimiento</a>
            </div>
          </li>
      </ul>
      <ul class="navbar-nav my-0">
          <li class="nav-item">
            <span class="nav-link">Bienvenido: <?php echo $_SESSION['user']; ?></span>
          </li>    
        </ul>
        <a href="../logout.php" class="btn-floating btn-sm btn-danger" id="logout"><i class="fas fa-power-off"></i></a>
    </div>
  </nav>

<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script src="../js/popper.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
<script src="../js/mdb.min.js"></script>

</body>
</html>