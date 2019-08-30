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
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!--<script>document.getElementsByTagName("html")[0].className += " js";</script>-->
  <title>Timeline</title>
  <link rel="shortcut icon" href="../img/keuken.ico">
  <link href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" rel="stylesheet">
  <link href="../css/bootstrap.min.css" rel="stylesheet">
  <link href="../css/mdb.min.css" rel="stylesheet">
  <link href="assets/css/style.css" rel="stylesheet">
<style>
.intro-2 {
    background: url("./assets/img/background.png") no-repeat center center;
    background-size: cover;
}
html,
body,
header,
.view {
    height: 70%;
}
</style>
</head>
<body>

<!--
<header>

    <nav class="navbar navbar-expand-lg navbar-dark black">
        <div class="container">
            <a class="navbar-brand" href="#"><strong>Navbar</strong></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Profile</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="view intro-2">
        <div class="full-bg-img">
            <div class="mask rgba-black-strong flex-center">
                <div class="container">
                    <div class="white-text text-center wow fadeInUp">
                        <h2>This Navbar isn't fixed</h2>
                        <h5>When you scroll down it will disappear</h5>
                        <br>
                        <p>Full page intro with background image will be always displayed in full screen mode, regardless of device </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</header>
-->
<!--Main Navigation-->
  
  
  <!--
	<header class="cd-main-header text-center flex flex-column flex-center">
    <h1>Responsive Vertical Timeline</h1>
    <p class="margin-top-sm">👈<a class="color-inherit" href="https://codyhouse.co/gem/vertical-timeline/">Article &amp; Download</a></p>
  </header>
  -->

  <section class="cd-timeline js-cd-timeline">
    
    <div class="container max-width-lg cd-timeline__container">

      <div id="timeline"></div>

      <!--
      <div class="cd-timeline__block">
        <div class="cd-timeline__img cd-timeline__img--movie">
          <img src="assets/img/cd-icon-movie.svg" alt="Movie">
        </div>

        <div class="cd-timeline__content text-component">
          <h2>Title of section 2</h2>
          <p class="color-contrast-medium">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?</p>
          
          <div class="flex justify-between items-center">
            <span class="cd-timeline__date">Jan 18</span>
            <a href="#0" class="btn btn--subtle">Read more</a>
          </div>
        </div> 
      </div> 
      -->

      <!--
      <div class="cd-timeline__block">
        <div class="cd-timeline__img cd-timeline__img--picture">
          <img src="assets/img/cd-icon-picture.svg" alt="Picture">
        </div> 

        <div class="cd-timeline__content text-component">
          <h2>Title of section 3</h2>
          <p class="color-contrast-medium">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi, obcaecati, quisquam id molestias eaque asperiores voluptatibus cupiditate error assumenda delectus odit similique earum voluptatem doloremque dolorem ipsam quae rerum quis. Odit, itaque, deserunt corporis vero ipsum nisi eius odio natus ullam provident pariatur temporibus quia eos repellat consequuntur perferendis enim amet quae quasi repudiandae sed quod veniam dolore possimus rem voluptatum eveniet eligendi quis fugiat aliquam sunt similique aut adipisci.</p>

          <div class="flex justify-between items-center">
            <span class="cd-timeline__date">Jan 24</span>
            <a href="#0" class="btn btn--subtle">Read more</a>
          </div>
        </div>
      </div>

      <div class="cd-timeline__block">
        <div class="cd-timeline__img cd-timeline__img--location">
          <img src="assets/img/cd-icon-location.svg" alt="Location">
        </div>

        <div class="cd-timeline__content text-component">
          <h2>Title of section 4</h2>
          <p class="color-contrast-medium">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde? Iste voluptatibus minus veritatis qui ut.</p>

          <div class="flex justify-between items-center">
            <span class="cd-timeline__date">Feb 14</span>
            <a href="#0" class="btn btn--subtle">Read more</a>
          </div>
        </div> 
      </div> 

      <div class="cd-timeline__block">
        <div class="cd-timeline__img cd-timeline__img--location">
          <img src="assets/img/cd-icon-location.svg" alt="Location">
        </div> 

        <div class="cd-timeline__content text-component">
          <h2>Title of section 5</h2>
          <p class="color-contrast-medium">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum.</p>

          <div class="flex justify-between items-center">
            <span class="cd-timeline__date">Feb 18</span>
            <a href="#0" class="btn btn--subtle">Read more</a>
          </div>
        </div> 
      </div> 
      <div class="cd-timeline__block">
        <div class="cd-timeline__img cd-timeline__img--movie">
          <img src="assets/img/cd-icon-movie.svg" alt="Movie">
        </div> 

        <div class="cd-timeline__content text-component">
          <h2>Final Section</h2>
          <p class="color-contrast-medium">This is the content of the last section</p>

          <div class="flex justify-between items-center">
            <span class="cd-timeline__date">Feb 26</span>
          </div>
        </div> 
      </div> 
      -->
    </div>
  </section> <!-- cd-timeline -->

<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js" integrity="sha256-4iQZ6BVL4qNKlQ27TExEhBN1HFPvAvAMbFavKKosSWQ=" crossorigin="anonymous"></script>
<script src="assets/js/main.js"></script>
<script>
$(function() {

  const params = new URLSearchParams(window.location.search);

  // ?enterprise=10010033&seller=105&date=2019-08-07
  if(params.has('seller') && params.has('date')) {

    const enterprise = <?php echo $_SESSION['enterprise']; ?>;
    //const enterprise = parseInt(params.get('enterprise'));
    const seller = parseInt(params.get('seller'));
    const date = params.get('date');

    let sellerName;
    let ordersDate = moment(date).format('DD/MM/YYYY');

    let timelineHtml = '';

    //$.getJSON(`./js/sellerroute.json`, { })
     $.getJSON(`../ws/sellerroute.php?enterprise=${enterprise}&seller=${seller}&date=${date}`, { })
      .done(function(orders) {

        const $timeline = $('#timeline');

        orders.sort(function(o1, o2) {
          return new Date(o1.date) - new Date(o2.date);
        });

        let timelineHtml = '';

        orders.forEach(order => {

          let ped = 0;
          let mnv = 0;
          let rvn = 0;
          let countPdvGeo = 0;
          let total = 0;
          let countInsideRadio = 0;
          let countOutsideRadio = 0;
          let counter = 0;
          let subTotalP = '';
          let imgClass;

          switch (order.tipo_order) {
            case 'PED':
              ped++;
              total += parseFloat(order.total);
              subTotalP = order.tipo_order === 'PED' ? `<p class="color-contrast-medium">Total: $${roundTwoDec(order.total)}</p>` : '';
              imgClass = 'cd-timeline__img--PED';
              ++counter;
              break;
            case 'MNV':
              mnv++;
              imgClass = 'cd-timeline__img--MNV';
              ++counter;
              break;
            case 'RVN':
              rvn++;
              imgClass = 'cd-timeline__img--RVN';
              break;
          }

          //const orderDate = moment(order.date); 

          timelineHtml += `
            <div class="cd-timeline__block">
              <div class="cd-timeline__img ${imgClass}">
                <span class="text-white">${order.tipo_order}</span>
              </div>
              <div class="cd-timeline__content text-component">
                <h3>PDV: ${order.pdv} ${order.nombre_pdv}</h3>
                <h4>${order.nosalereason}</h4>
                ${subTotalP}
                <div class="flex justify-between items-center">
                  <span class="cd-timeline__date">${moment(order.date).format('hh:mm:ss')}</span>
                </div>
              </div>
            </div>`;

        });

        $timeline.html(timelineHtml);

        /*
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
            }
          ],
          events
        }

        const timeline = new TL.Timeline('timeline', timelineData, {
          initial_zoom: 6
        });
        */

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
</script>
</body>
</html>