<nav class="navbar navbar-expand-lg navbar-dark unique-color">
  <a class="navbar-brand" href="./">Inicio</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#maps-nav" aria-controls="maps-nav" aria-expanded="false" aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="maps-nav">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" id="dropdown-seller" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Vendedor</a>
        <div class="dropdown-menu dropdown-primary" aria-labelledby="dropdown-sellerMenuLink">
          <a class="dropdown-item" href="sellerroute.php">Ruta</a>
          <!--
            <a class="dropdown-item" href="./sellerroute.html?enterprise=10010033">Ruta</a>
            <a class="dropdown-item" href="#">Seguimiento</a>
          -->
          <!--
            <a class="dropdown-item" href="./tracksforseller.html?enterprise=10010033">Seguimiento</a>
            -->
        </div>
      </li>
      <!--
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" id="dropdown-enterprise" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Empresa</a>
        <div class="dropdown-menu dropdown-primary" aria-labelledby="dropdown-enterpriseMenuLink">
          <a class="dropdown-item" href="#">Seguimiento</a>
        </div>
      </li>
      -->
    </ul>
    <ul class="navbar-nav my-0">
      <li class="nav-item">
        <span class="nav-link">Bienvenido: <?php echo $_SESSION['user']; ?></span>
      </li>
    </ul>
    <a href="../logout.php" class="btn-floating btn-sm btn-danger" id="logout"><i class="fas fa-power-off"></i></a>
  </div>
</nav>