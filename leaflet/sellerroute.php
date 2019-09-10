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
  <title>Vendedor Ruta</title>
  <link rel="shortcut icon" href="../img/keuken.ico">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
  integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
  crossorigin="" rel="stylesheet"/>
  <link href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" rel="stylesheet">
  <link href="../css/bootstrap.min.css" rel="stylesheet">
  <link href="../css/mdb.min.css" rel="stylesheet">
  <link href="./css/sellerroute.css" rel="stylesheet">
</head>
<body>

  <?php require_once './commons/navbar.php'; ?>

  <div class="container-fluid mt-2">
    
    <div class="row">
      <div class="col-md-2">
        <div class="md-form">
          <input placeholder="Fecha" type="text" id="date" class="form-control datepicker">
          <label for="date">Seleccione fecha</label>
        </div>
      </div>
      <div class="col-md-3">
        <select class="mdb-select md-form colorful-select dropdown-info" id="supervisor-select" searchable="Seleccionar distribuidor">
        </select>
        <label class="mdb-main-label"><small>Distribuidor</small></label>
      </div>
      <div class="col-md-3">
        <select class="mdb-select md-form colorful-select dropdown-info" id="seller-select" searchable="Seleccionar vendedor">
        </select>
        <label class="mdb-main-label"><small>Vendedor</small></label>
      </div>
      <div class="col-md-2">
        <select class="mdb-select md-form colorful-select dropdown-info" id="map-select" searchable="Seleccionar mapa">
            <option value="0" selected>Normal</option>
            <option value="1">Satélite</option>
        </select>
        <label class="mdb-main-label"><small>Tipo de mapa</small></label>
      </div>
      <div class="col-md-2 mb-2">
        <button type="button" id="btn-submit" class="btn blue-gradient mt-3">Consultar <i class="fas fa-eye"></i></button>
      </div>
    </div>
  
    <div class="row mb-3">
      <div class="col-md-9 mb-3">
        <div class="card">
          <div class="card-body">
            <div id="map"></div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="../img/redMarker.svg" alt="red-marker" class="marker">PEDIDO</span>
                <span class="badge badge-primary badge-pill" id="ped">0</span> 
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="../img/blueMarker.svg" alt="blue-marker" class="marker">MNV</span>
                <span class="badge badge-primary badge-pill" id="mnv">0</span> 
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="../img/blackMarker.svg" alt="black-marker" class="marker">SIN VISITA</span>
                <span class="badge badge-primary badge-pill" id="rvn">0</span> 
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>&nbsp;<i class="far fa-compass text-success"></i>&nbsp; Con GEO</span>
                <span class="badge badge-primary badge-pill" id="geo">0</span> 
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>&nbsp;<i class="fas fa-compass text-danger"> </i>&nbsp; Sin GEO</span>
                <span class="badge badge-primary badge-pill" id="wgeo">0</span> 
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="../img/greenLine.png" alt="green-line"> < 100 mts</span>
                <span class="badge badge-primary badge-pill" id="inside-radio">0</span> 
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="../img/redLine.png" alt="red-line"> > 100 mts</span>
                <span class="badge badge-primary badge-pill" id="outside-radio">0</span> 
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>Total</span>
                <span class="badge badge-primary badge-pill" id="total">$ 0</span> 
              </li>
              <li class="list-group-item" id="timeline-container">
                <a class="btn btn-block aqua-gradient" id="timeline" target="_blank">Timeline <i class="far fa-calendar-alt"></i></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div class="modal fade left" id="modal-items" tabindex="-1" role="dialog" aria-labelledby="modalItemsLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-full-height modal-left modal-notify modal-info" role="document">
      <div class="modal-content">
        <div class="modal-header unique-color white-text">
          <h4 class="title">Detalle</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body mb-0" id="items"></div>
      </div>
    </div>
  </div>

<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script src="../js/popper.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
<script src="../js/mdb.min.js"></script>
<script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"
  integrity="sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og=="
  crossorigin=""></script>
<script src="./js/Control.FullScreen.js"></script>
<script src="./js/tilesLayer.js"></script>
<script src="../js/moment.min.js"></script>
<script src="../js/OrderDescription.js"></script>
<script src="./js/sellerroute.js"></script>
<script src="../js/bootstrap-datepicker.es.js"></script>
<script>
const enterprise = <?php echo $_SESSION['enterprise']; ?>;
</script>
</body>
</html>