$(function() {

  const params = new URLSearchParams(window.location.search);
  
  if(params.has('enterprise')) {
    
    const map = L.map('map', {
      center: [-34.603722, -58.381592],
      zoom: 12
    });

    tilesLayer[0].addTo(map);

    const enterprise = parseInt(params.get('enterprise'));

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
        const $date = $('#date');
        const $supervisorSelect = $('#supervisor-select');
        const $sellerSelect = $('#seller-select');
        const $mapSelect = $('#map-select');
        const $btnSubmit = $('#btn-submit');

        let date = today;
        let seller;

        let mapLayerIndex = 0;
        const zoom = 16;

        $date.val(date);

        let layerIcons;
        let layerLines;
        let markers = [];
        let lines = [];

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

                  let minLat = -Infinity;
                  let minLon = -Infinity;
                  let maxLat = Infinity;
                  let maxLon = Infinity;

                  let ped = 0;
                  let mnv = 0;
                  let rvn = 0;
                  let countGeo = 0;

                  const iconOrder = L.icon({
                    iconUrl: '../img/seller.svg',
                    iconAnchor: [16, 29]
                  });

                  orders.forEach(order => {

                    if(order.latitud_pdv !== null && order.longitud_pdv !== null && 
                      !isNaN(parseFloat(order.latitud_pdv) && !isNaN(parseFloat(order.longitud_pdv)))) {

                      countGeo++;
          
                      let latPdv = parseFloat(order.latitud_pdv);
                      let lonPdv = parseFloat(order.longitud_pdv);

                      minLat = latPdv > minLat ? latPdv : minLat;
                      minLon = lonPdv > minLon ? lonPdv : minLon;
                      maxLat = latPdv < maxLat ? latPdv : maxLat;
                      maxLon = lonPdv < maxLon ? lonPdv : maxLon;

                      let distPdvOrder = 0;

                      if(order.latitud_order !== null && order.longitud_order !== null &&
                        !isNaN(parseFloat(order.latitud_order) && !isNaN(parseFloat(order.longitud_order)))) {
                      // if(isNaN(order.longitud_order) && isNaN(order.latitud_order)) {

                        const latOrder = parseFloat(order.latitud_order);
                        const lonOrder = parseFloat(order.longitud_order);

                        distPdvOrder = roundTwoDec(L.latLng(latPdv, lonPdv).distanceTo(L.latLng(latOrder, lonOrder)) / 1000);

                        if(distPdvOrder > 0) {
          
                          const markerOrder = L.marker([latOrder, lonOrder], { icon: iconOrder });
                          markers.push(markerOrder);
            
                          const linePdvOrder = [
                            [latPdv, lonPdv],
                            [latOrder, lonOrder]
                          ];
            
                          lines.push(L.polyline(linePdvOrder, { color: '#e53935', weight: 5 }));
                        }
                      }
                      
                      switch(order.tipo_order) {
                        case 'PED':
                          ped++;
                          iconUrl = '../img/redMarker.svg';
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
          
                      const desc = `<h5>${order.nombre_pdv}</h5>
                        <p>${ moment(order.date).format('DD/MM/YYYY, hh:mm:ss')} <b>${ order.nosalereason }</b></p><p>Total: $${order.total}</p>
                        <p>Distancia: <a href="#">${distPdvOrder} Km</a></p>`;
          
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