$(function() {

  const today = getCurrentDate();

  const $date = $('#date');

  $date.val(today);

  $date.pickadate();

  const map = L.map('map', {
    center: [-34.603722, -58.381592],
    zoom: 12,
    fullscreenControl: true
  });

  /*
		map.on('enterFullscreen', function(){
			if(window.console) window.console.log('enterFullscreen');
		});
		map.on('exitFullscreen', function(){
			if(window.console) window.console.log('exitFullscreen');
    });
    */

  tilesLayer[0].addTo(map);

  $.getJSON(`../ws/getusersforenterprise.php?enterprise=${enterprise}&tracking=1`, {})
    // $.getJSON(`./js/sellers.json`, { })
    .done(function(data) {

      const sellers = data;

      const $ped = $('#ped');
      const $mnv = $('#mnv');
      const $rvn = $('#rvn');
      const $geo = $('#geo');
      const $wgeo = $('#wgeo');
      const $insideRadio = $('#inside-radio');
      const $outsideRadio = $('#outside-radio');
      const $total = $('#total');
      const $supervisorSelect = $('#supervisor-select');
      const $sellerSelect = $('#seller-select');
      const $mapSelect = $('#map-select');
      const $btnSubmit = $('#btn-submit');
      const $timeLineContainer = $('#timeline-container');
      const $timeline = $('#timeline');

      const zoom = 14;

      let date = today;
      const outsideRadio = 0.1;
      let seller;

      let mapLayerIndex = 0;

      let layerIcons;
      let layerLines;
      let markers = [];
      let lines = [];

      let supervisors = new Map();

      let supervisorSelectHtml = '';

      sellers.forEach(seller => {

        if (supervisors.has(seller.supervisor)) {
          supervisors.set(seller.supervisor,
            [...supervisors.get(seller.supervisor), seller]
          );
        } else {
          supervisorSelectHtml += `<option value="${seller.supervisor}">${seller.supervisor}</option>`;
          supervisors.set(seller.supervisor, [seller]);
        }
      });

      $sellerSelect.html(supervisorSelected(supervisors.keys().next().value));
      $supervisorSelect.html(supervisorSelectHtml);

      $sellerSelect.find('option:eq(0)').attr('selected', true);
      $supervisorSelect.find('option:eq(0)').attr('selected', true);

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
        descriptions = [];
        if (layerIcons) {
          map.removeLayer(layerIcons);
        }
        if (layerLines) {
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

      $('.mdb-select').materialSelect();

      $btnSubmit.click(function() {

        reset();

        seller = $sellerSelect.val();

        if (seller !== null) {

          $.getJSON(`../ws/sellerroute.php?enterprise=${enterprise}&seller=${seller}&date=${date}`, {})
            .done(orders => {

              if (orders.length > 0) {

                orders.sort(function(o1, o2) {
                  return new Date(o1.date) - new Date(o2.date);
                });

                $timeLineContainer.css('display', 'block');

                $timeline.attr('href', `../timeline/?seller=${seller}&date=${date}`);

                let minLat = -Infinity;
                let minLon = -Infinity;
                let maxLat = Infinity;
                let maxLon = Infinity;

                let ped = 0;
                let mnv = 0;
                let rvn = 0;
                let countPdvGeo = 0;
                let total = 0;
                let countInsideRadio = 0;
                let countOutsideRadio = 0;
                let counter = 0;
                let isPdvGeo = false;
                let isOrderGeo = false;

                orders.forEach(order => {

                  isPdvGeo = order.latitud_pdv !== null && order.longitud_pdv !== null && !isNaN(parseFloat(order.latitud_pdv) && !isNaN(parseFloat(order.longitud_pdv)));

                  isOrderGeo = order.latitud_order !== null && order.longitud_order !== null && !isNaN(parseFloat(order.latitud_order) && !isNaN(parseFloat(order.longitud_order)));
                
                  const orderDescription = new OrderDescription();

                  const orderDate = moment(order.date).format('hh:mm:ss');

                  let iconClass;
                  let badgeColor;

                  switch (order.tipo_order) {
                    case 'PED':
                      ped++;
                      total += parseFloat(order.total);
                      if(isPdvGeo || isOrderGeo) {
                        if (isPdvGeo) {
                          iconClass = 'red-marker';
                          ++counter;
                        }
                        badgeColor = '#ff4444';
                      }
                      break;
                    case 'MNV':
                      mnv++;
                      if(isPdvGeo || isOrderGeo) {
                        if (isPdvGeo) {
                          iconClass = 'blue-marker';
                          ++counter;
                        }
                        badgeColor = '#33b5e5';
                      }
                      break;
                    case 'RVN':
                      rvn++;
                      if(isPdvGeo || isOrderGeo) {
                        if (isPdvGeo) {
                          iconClass = 'black-marker';
                        }
                        badgeColor = '#212121';
                      }
                      break;
                  }

                  orderDescription.setDate(orderDate);
                  orderDescription.setPdv(order.pdv);
                  orderDescription.setPdvNombre(order.nombre_pdv);
                  orderDescription.setNoSaleReason(order.nosalereason);
                  orderDescription.setOrderTotal(roundTwoDec(order.total));
                  orderDescription.setBadgeColor(badgeColor);

                  let latPdv;
                  let lonPdv;

                  if (isOrderGeo && isPdvGeo) {

                    latPdv = parseFloat(order.latitud_pdv);
                    lonPdv = parseFloat(order.longitud_pdv);
                    const latOrder = parseFloat(order.latitud_order);
                    const lonOrder = parseFloat(order.longitud_order);

                    countPdvGeo++;

                    minLat = latPdv > minLat ? latPdv : minLat;
                    minLon = lonPdv > minLon ? lonPdv : minLon;
                    maxLat = latPdv < maxLat ? latPdv : maxLat;
                    maxLon = lonPdv < maxLon ? lonPdv : maxLon;

                    const distPdvOrder = roundTwoDec(L.latLng(latPdv, lonPdv).distanceTo(L.latLng(latOrder, lonOrder)) / 1000);

                    if (distPdvOrder > 0) {

                      orderDescription.setDistPdvOrder(distPdvOrder);

                      if (distPdvOrder > outsideRadio) {
                        color = '#e53935';
                        iconOrderUrl = '../img/redSeller.svg';
                        countOutsideRadio++;
                      } else {
                        color = '#007E33';
                        iconOrderUrl = '../img/greenSeller.svg';
                        countInsideRadio++;
                      }

                      const linePdvOrder = [
                        [latPdv, lonPdv],
                        [latOrder, lonOrder]
                      ];

                      lines.push(L.polyline(linePdvOrder, {
                        color,
                        weight: 2
                      }));

                    }

                    const iconPdv = L.divIcon({
                      iconAnchor: [22, 38],
                      iconSize: [40, 40],
                      popupAnchor: [0, -38],
                      className: iconClass,
                      html: (iconClass !== 'black-marker' ? `<div class="badges"><span class="badge badge-success">${counter}</span><span class="badge" style="background:${badgeColor}">${orderDate}</span></div>` : '')
                    });

                    const markerPdv = L.marker([latPdv, lonPdv], {
                      icon: iconPdv
                    });

                    const iconOrder = L.icon({
                      iconUrl: iconOrderUrl,
                      iconAnchor: [16, 29],
                      popupAnchor: [0, -29]
                    });

                    const markerOrder = L.marker([latOrder, lonOrder], {
                      icon: iconOrder
                    });

                    markerPdv.bindPopup(orderDescription.toStr());
                    markers.push(markerPdv);
                    markerOrder.bindPopup(orderDescription.toStr());
                    markers.push(markerOrder);

                  } else if (isPdvGeo && !isOrderGeo) {

                    latPdv = parseFloat(order.latitud_pdv);
                    lonPdv = parseFloat(order.longitud_pdv);

                    countPdvGeo++;

                    minLat = latPdv > minLat ? latPdv : minLat;
                    minLon = lonPdv > minLon ? lonPdv : minLon;
                    maxLat = latPdv < maxLat ? latPdv : maxLat;
                    maxLon = lonPdv < maxLon ? lonPdv : maxLon;

                    const iconPdv = L.divIcon({
                      iconAnchor: [22, 38],
                      iconSize: [40, 40],
                      popupAnchor: [0, -38],
                      className: iconClass,
                      html: (iconClass !== 'black-marker' ? `<div class="badges"><span class="badge badge-success">${counter}</span><span class="badge" style="background:${badgeColor}">${orderDate}</span></div>` : '')
                    });

                    const markerPdv = L.marker([latPdv, lonPdv], {
                      icon: iconPdv
                    });

                    markerPdv.bindPopup(orderDescription.toStr());
                    markers.push(markerPdv);

                  } else if (!isPdvGeo && isOrderGeo) {

                    const latOrder = parseFloat(order.latitud_order);
                    const lonOrder = parseFloat(order.longitud_order);

                    const iconOrderUrl = '../img/graySeller.svg';
                    
                    const iconOrder = L.icon({
                      iconUrl: iconOrderUrl,
                      iconAnchor: [16, 29],
                      popupAnchor: [0, -29]
                    });

                    const markerOrder = L.marker([latOrder, lonOrder], {
                      icon: iconOrder
                    });

                    markerOrder.bindPopup(orderDescription.toStr());
                    markers.push(markerOrder);
                  }

                });

                $ped.text(ped);
                $mnv.text(mnv);
                $rvn.text(rvn);
                $geo.text(countPdvGeo);
                $wgeo.text(orders.length - countPdvGeo);
                $insideRadio.text(countInsideRadio);
                $outsideRadio.text(countOutsideRadio);
                $total.text('$ ' + roundTwoDec(total));

                layerIcons = L.layerGroup(markers);
                layerIcons.addTo(map);

                layerLines = L.layerGroup(lines);
                layerLines.addTo(map);

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

  function getCurrentDate() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    return yyyy + '-' + mm + '-' + dd;
  }

  function roundTwoDec(num) {
    return Math.round(num * 100) / 100;
  }
  //}

});