<?php

if($_POST) {

  $username = trim($_POST['username']);
  $password = trim($_POST['password']);

  $response = file_get_contents('http://keu.webhop.org:8991/checklogin?username=' . $username . '&password=' . $password);

  if($response === 'ERROR') {
    $error = true;
  } else {

    $response = json_decode($response, true);

    $enterprise = intval($response["enterprise"]);
    $user = $response["user_type"];

    session_start();
    
    $_SESSION['enterprise'] = $enterprise;
    $_SESSION['user'] = $user;

    header('Location: ./leaflet/sellerroute.php');
    die();
  }
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Login</title>
  <link rel="shortcut icon" href="./img/keuken.ico">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
  integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
  crossorigin="" rel="stylesheet"/>
  <link href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" rel="stylesheet">
  <link href="./css/bootstrap.min.css" rel="stylesheet">
  <link href="./css/mdb.min.css" rel="stylesheet">
  <link href="./css/style.css" rel="stylesheet">
</head>
<body>

  <nav class="navbar navbar-expand-lg navbar-dark unique-color mb-5">
    <a class="navbar-brand" href="#">Login</a>
      
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#maps-nav" aria-controls="maps-nav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
      
  </nav>

  <div class="container-fluid">
    
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">

          <h5 class="card-header blue-gradient white-text text-center py-4">
            <strong>Bienvenido al sistema de mapas</strong>
          </h5>
        
          <div class="card-body px-lg-5 pt-0">
        
            <form action="<?php echo $_SERVER['PHP_SELF']; ?>" class="text-center" style="color: #757575;" method="POST">

              <!--
              <div class="md-form mt-5">
                <input type="number" name="enterprise" class="form-control" value="10010033" required autofocus>
                <label for="enterprise">Empresa</label>
              </div>
              -->
              
              <div class="md-form mt-5">
                <input type="text" name="username" id="username" class="form-control" maxlength="30" required autofocus>
                <label for="username">Usuario</label>
              </div>
              <div class="md-form">
                <input type="password" name="password" id="password" class="form-control" maxlength="30" required>
                <label for="password">Password</label>
              </div>
              <hr>
              <button class="btn blue-gradient btn-block my-4 waves-effect z-depth-0" type="submit">Ingresar</button>
        
            </form>

            <?php if(isset($error) && $error) { ?>
              <hr>
              <div class="btn btn-danger btn-block">
                Usuario o clave incorrectos
              </div>
            <?php } ?>
        
          </div>
        </div>
      </div>
    </div>

  </div>

<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script src="./js/popper.min.js"></script>
<script src="./js/bootstrap.min.js"></script>
<script src="./js/mdb.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js"></script>

</body>
</html>