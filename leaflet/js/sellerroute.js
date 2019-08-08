$(function() {

  const params = new URLSearchParams(window.location.search);
  
  if(params.has('enterprise')) {

    const enterprise = parseInt(params.get('enterprise'));
    
    const map = L.map('map', {
      center: [-34.603722, -58.381592],
      zoom: 12
    });

    tilesLayer[0].addTo(map);

    $.getJSON(`http://keu.webhop.org:8991/getusersforenterprise?enterprise=${enterprise}&tracking=1`, { })
    // $.getJSON(`./js/sellers.json`, { })
      .done(function(data) {

        const sellers = data;
  
        Date.prototype.toDateInputValue = (function() {
          const local = new Date(this);
          local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
          return local.toJSON().slice(0, 10);
        });

        const today = new Date().toDateInputValue();
    
        const $ped = $('#ped');
        const $mnv = $('#mnv');
        const $rvn = $('#rvn');
        const $geo = $('#geo');
        const $wgeo = $('#wgeo');
        const $insideRadio = $('#inside-radio');
        const $outsideRadio = $('#outside-radio');
        const $total = $('#total');
        const $date = $('#date');
        const $supervisorSelect = $('#supervisor-select');
        const $sellerSelect = $('#seller-select');
        const $mapSelect = $('#map-select');
        const $btnSubmit = $('#btn-submit');
        const $timeLineContainer = $('#timeline-container');
        const $timeline = $('#timeline');
        //const $orderDescription = $('#order-description');

        let date = today;
        const outsideRadio = 0.1;
        let seller;

        let mapLayerIndex = 0;
        const zoom = 16;

        $date.val(date);

        let layerIcons;
        let layerLines;
        let markers = [];
        let lines = [];
        //let xLabels = [];
        //let chartData = [];
        //let descriptions = [];

        let supervisors = new Map();

        let supervisorSelectHtml = '';

        sellers.forEach(seller => {

          if(supervisors.has(seller.supervisor)) {
            supervisors.set(seller.supervisor,
              [...supervisors.get(seller.supervisor), seller ]
            );
          } else {
            supervisorSelectHtml += `<option value="${seller.supervisor}">${seller.supervisor}</option>`;
            supervisors.set(seller.supervisor, [ seller ]);
          }
        });

        $supervisorSelect.html(supervisorSelectHtml);

        $sellerSelect.html(supervisorSelected(supervisors.keys().next().value));

        function supervisorSelected(supervisor) {

          let sellerSelectHtml = '';

          supervisors.get(supervisor).forEach(seller => {
            sellerSelectHtml += `<option value="${seller.id}">${seller.name}</option>`;
          });
          
          return sellerSelectHtml;
        }

        function reset() {
          markers = [];
          lines = [];
          //xLabels = [];
          //chartData = [];
          descriptions = [];
          //$descriptionContainer.hide();
          if(layerIcons) {
            map.removeLayer(layerIcons);
          }
          if(layerLines) {
            map.removeLayer(layerLines);
          }
        }

        $date.change(function() {
          date = $(this).val();
        });

        $supervisorSelect.change(function() {
          const $supervisorSelected = $(this).find(':selected');
          supervisor = $supervisorSelected.val();
          $sellerSelect.html(supervisorSelected(supervisor));
        });

        $sellerSelect.change(function() {
          const $sellerSelected = $sellerSelect.find(':selected');
          seller = $sellerSelected.val();
        });

        $mapSelect.change(function() {
          map.removeLayer(tilesLayer[mapLayerIndex]);
          mapLayerIndex = parseInt($(this).find(':selected').val());
          tilesLayer[mapLayerIndex].addTo(map);
        });

        $('.mdb-select').material_select();
          
        $btnSubmit.click(function() {

          reset();
                  
          seller = $sellerSelect.val();
                  
          if(seller !== null) {

            $.getJSON(`http://keu.webhop.org:8991/sellerroute?enterprise=${enterprise}&seller=${seller}&date=${date}`, { })
              .done(orders => {

                if(orders.length > 0) {

                  $timeLineContainer.css('display', 'block');

                  $timeline.attr('href', `../timeline/?enterprise=${enterprise}&seller=${seller}&date=${date}`);

                  //$canvasContainer.show();

                  let minLat = -Infinity;
                  let minLon = -Infinity;
                  let maxLat = Infinity;
                  let maxLon = Infinity;

                  let ped = 0;
                  let mnv = 0;
                  let rvn = 0;
                  let countGeo = 0;
                  let total = 0;
                  let countInsideRadio = 0;
                  let countOutsideRadio = 0;

                  orders.forEach(order => {

                    let distPdvOrder = 0;

                    //descriptions.push(desc);

                    //xLabels.push(moment(order.date).format('hh:mm:ss'));
                    //chartData.push(order.tipo_order);

                    const orderTotal = roundTwoDec(order.total);
                    const orderTotalStr = orderTotal > 0 ? `<br>Total: $${orderTotal}` : '';

                    let desc = `${ moment(order.date).format('DD/MM/YYYY hh:mm:ss')}<h5><span class="badge badge-info">${order.nombre_pdv}</span></h5>
                    <b>${ order.nosalereason }</b>${orderTotalStr}`;

                    if(order.latitud_pdv !== null && order.longitud_pdv !== null && 
                      !isNaN(parseFloat(order.latitud_pdv) && !isNaN(parseFloat(order.longitud_pdv)))) {

                      countGeo++;
          
                      let latPdv = parseFloat(order.latitud_pdv);
                      let lonPdv = parseFloat(order.longitud_pdv);

                      minLat = latPdv > minLat ? latPdv : minLat;
                      minLon = lonPdv > minLon ? lonPdv : minLon;
                      maxLat = latPdv < maxLat ? latPdv : maxLat;
                      maxLon = lonPdv < maxLon ? lonPdv : maxLon;

                      if(order.latitud_order !== null && order.longitud_order !== null &&
                        !isNaN(parseFloat(order.latitud_order) && !isNaN(parseFloat(order.longitud_order)))) {
                        // if(isNaN(order.longitud_order) && isNaN(order.latitud_order)) {

                        const latOrder = parseFloat(order.latitud_order);
                        const lonOrder = parseFloat(order.longitud_order);

                        distPdvOrder = roundTwoDec(L.latLng(latPdv, lonPdv).distanceTo(L.latLng(latOrder, lonOrder)) / 1000);

                        desc += `<br>Distancia: <a href="#">${distPdvOrder} Km</a>`;

                        if(distPdvOrder > 0) {

                          let color;
                          let iconOrderUrl;

                          if(distPdvOrder > outsideRadio) {
                            color = '#e53935';
                            iconOrderUrl = '../img/redSeller.svg';
                            countOutsideRadio++;
                          } else {
                            color = '#007E33';
                            iconOrderUrl = '../img/greenSeller.svg';
                            countInsideRadio++;
                          }

                          const iconOrder = L.icon({
                            iconUrl: iconOrderUrl,
                            iconAnchor: [16, 29],
                            popupAnchor: [0, -29]
                          });
          
                          const markerOrder = L.marker([latOrder, lonOrder], 
                            { icon: iconOrder }
                          );
                          markerOrder.bindPopup(desc);
                          markers.push(markerOrder);
            
                          const linePdvOrder = [
                            [latPdv, lonPdv],
                            [latOrder, lonOrder]
                          ];
            
                          lines.push(L.polyline(linePdvOrder, { 
                            color, 
                            weight: 2 
                          }));
                        }
                      }
                      
                      switch(order.tipo_order) {
                        case 'PED':
                          ped++;
                          iconUrl = '../img/redMarker.svg';
                          total += parseFloat(order.total);
                          break;
                        case 'MNV':
                          mnv++;
                          iconUrl = '../img/blueMarker.svg';
                          break;
                        case 'RVN':
                          rvn++;
                          iconUrl = '../img/orangeMarker.svg';
                          break;
                        default:
                          iconUrl = '../img/uniqueMarker.svg';
                          break;
                      }
          
                      const iconPdv = L.icon({
                        iconUrl,
                        iconAnchor: [22, 38],
                        popupAnchor: [0, -38]
                      });
          
                      const markerPdv = L.marker([latPdv, lonPdv], { icon: iconPdv });
                      markerPdv.bindPopup(desc);
                      markers.push(markerPdv);
                    
                    } else {
          
                      switch(order.tipo_order) {
                        case 'PED':
                          ped++;
                          total += parseFloat(order.total);
                          break;
                        case 'MNV':
                          mnv++;
                          break;
                        case 'RVN':
                          rvn++;
                          break;
                      }
                    }
                  });
          
                  $ped.text(ped);
                  $mnv.text(mnv);
                  $rvn.text(rvn);
                  $geo.text(countGeo);
                  $wgeo.text(orders.length - countGeo);
                  $insideRadio.text(countInsideRadio);
                  $outsideRadio.text(countOutsideRadio);
                  $total.text('$ ' + roundTwoDec(total));
       
                  layerIcons = L.layerGroup(markers);
                  layerIcons.addTo(map);
          
                  layerLines = L.layerGroup(lines);
                  layerLines.addTo(map);
          
                  //const distMaxMin = L.latLng(maxLat, maxLon).distanceTo(L.latLng(minLat, minLon));

                  map.setView([(maxLat + minLat) / 2, (maxLon + minLon) / 2], zoom);

                }

              }).fail((jqxhr, textStatus, error) => {
                const err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
              });
          }
          
        });

      }).fail((jqxhr, textStatus, error) => {
        const err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
      });

  }
    
  function roundTwoDec(num){
    return Math.round(num * 100) / 100;
  }
});