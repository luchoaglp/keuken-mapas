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
  <title>Timeline</title>
  <link rel="shortcut icon" href="../img/keuken.ico">
  <link href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" rel="stylesheet">
  <link href="../css/bootstrap.min.css" rel="stylesheet">
  <link href="../css/mdb.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <style>
    html, body {
      height:100%;
      padding: 0px;
      margin: 0px;
    }
  </style>
  <!-- HTML5 shim, for IE6-8 support of HTML elements--><!--[if lt IE 9]>
  <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
</head>
<body>

<div id="timeline"></div>

<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js" integrity="sha256-4iQZ6BVL4qNKlQ27TExEhBN1HFPvAvAMbFavKKosSWQ=" crossorigin="anonymous"></script>
<script src="js/timeline-min.js"></script>

<script>
$(function() {

  const params = new URLSearchParams(window.location.search);

  // ?enterprise=10010033&seller=105&date=2019-08-07
  if(params.has('seller') && params.has('date')) {

    const enterprise = <?php echo $_SESSION['enterprise']; ?>;
    const seller = parseInt(params.get('seller'));
    const date = params.get('date');

    let sellerName;
    let ordersDate = moment(date).format('DD/MM/YYYY');

     $.getJSON(`http://keu.webhop.org:8991/sellerroute?enterprise=${enterprise}&seller=${seller}&date=${date}`, { })
      .done(function(orders) {

        let events = [];

        if(orders.length > 0) {

          sellerName = orders[0].nombre_seller;
          ordersDate = orders[0].date;

          orders.forEach(order => {
          
            const orderDate = moment(order.date);
            
            events.push({
              start_date: {
                hour: orderDate.hours(),
                minute: orderDate.minutes(),
                display_date: moment(order.date).format('DD/MM/YYYY, hh:mm:ss')
              },
              end_date: {
                hour: orderDate.hours(),
                minute: orderDate.minutes(),
                display_date: moment(order.date).format('DD/MM/YYYY, hh:mm:ss')
              },
              media: {
                url: "./img/1.jpg",
                thumbnail: "./img/1.jpg",
                caption: `Comercio: ${order.nombre_pdv}`
              },
              background: {
                opacity: "50",
                url: "./img/background.png"
              },
              text: {
                headline: `<b>${order.nombre_pdv}</b><br><br>
                           ${ order.nosalereason }<br>
                           Total: $${roundTwoDec(order.total)}`,
                text: order.nosalereason 
              } 
            });
          });
        }

        const timelineData = {
          title: {
            text: {
              headline: "Ordenes",
              text: `<h6>Vendedor: ${sellerName}</h6>
                     <p>Fecha: ${ moment('2019-08-07').format('DD/MM/YYYY')}</p>`,
            }
          },
          eras: [
            {
              start_date: {
                hour: 0
              },
              end_date: {
                hour: 23
              },
              /*
              text: {
                headline: "Era Test 700-720"
              }
              */
            }
          ],
          events
        }

        const timeline = new TL.Timeline('timeline', timelineData, {
          initial_zoom: 6
        });

    }).fail((jqxhr, textStatus, error) => {
      const err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
    });

    function roundTwoDec(num){
      return Math.round(num * 100) / 100;
    }
  }
});
</script>
      
  </body>
</html>