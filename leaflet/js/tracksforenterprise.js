$(function() {

  $('.mdb-select').materialSelect();

  const params = new URLSearchParams(window.location.search);
  
  if(params.has('enterprise')) {

    const map = L.map('map', {
      center: [-34.603722, -58.381592],
      zoom: 12,
      preferCanvas: true
    });
  
    const enterprise = parseInt(params.get('enterprise'));

    const colors = ['#FF0000', '#00C851', '#33b5e5', '#aa66cc', '#00695c', '#3F729B'];

    let colorSeller = new Map();

    $.getJSON(`http://keu.webhop.org:8991/getusersforenterprise?enterprise=${enterprise}&tracking=1`, { })
      .done(function(data) {

        const sellers = data;

        let colorIdx = 0;
  
        sellers.forEach(seller => {
          colorSeller.set(seller.id, colors[colorIdx++]);
        });

      }).fail((jqxhr, textStatus, error) => {
        const err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
      });
    
    Date.prototype.toDateInputValue = (function() {
      let local = new Date(this);
      local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
      return local.toJSON().slice(0, 10);
    });
  
    const today = new Date().toDateInputValue();
  
    const $from = $('#from');
    const $to = $('#to');
    const $mapSelect = $('#map-select');
    const $btnSubmit = $('#btn-submit');
    // $seller = $('#seller');
    // $fromSelected = $('#from-selected');
    // $toSelected = $('#to-selected');
    // $quantity = $('#quantity');
    let from = today;
    let to = today;
    // let seller;
    // let sellerName;
  
    let mapLayerIndex = 0;
    const zoom = 12;
  
    tilesLayer[mapLayerIndex].addTo(map);
  
    $from.val(today);
    $to.val(today);

    let layerIcons;
    let markers = [];
  
    function reset() {
      markers = [];
      if(layerIcons) {
        map.removeLayer(layerIcons);
      }
    }
  
    $from.change(function() {
      from = $(this).val();
    });
  
    $to.change(function() {
      to = $(this).val();
    });
  
    $mapSelect.change(function() {
      map.removeLayer(tilesLayer[mapLayerIndex]);
      mapLayerIndex = parseInt($(this).find(':selected').val());
      tilesLayer[mapLayerIndex].addTo(map);
    });
  
    $btnSubmit.click(function() {
    
      reset();
                      
      $.getJSON(`http://keu.webhop.org:8991/gettracksforenterprise?enterprise=${enterprise}&fromdate=${from}&untildate=${to}`, { })
      // $.getJSON(`./js/tracksforenterprise.json`, { })
  
        .done(tracks => {
  
          // $quantity.text(tracks.length);
  
          if(tracks.length > 0) {
  
            let minLat = -Infinity;
            let minLon = -Infinity;
            let maxLat = Infinity;
            let maxLon = Infinity;
  
            /*
            const iconOrder = L.icon({
              iconUrl: './img/circle.svg',
              iconSize: [10, 10],
              iconAnchor: [0, 0],
              popupAnchor: [0, 0]
            });
            */

            // let firstLatOrder = tracks[0].latitud_order;
            // let firstLonOrder = tracks[0].longitud_order;
  
            tracks.forEach(track => {
  
              const latOrder = parseFloat(track.latitud_order);
              const lonOrder = parseFloat(track.longitud_order);
  
              minLat = latOrder > minLat ? latOrder : minLat;
              minLon = lonOrder > minLon ? lonOrder : minLon;
              maxLat = latOrder < maxLat ? latOrder : maxLat;
              maxLon = lonOrder < maxLon ? lonOrder : maxLon;
  
              /*
              const desc = `<h5></h5>
                <p>${ moment(track.date).format('DD/MM/YYYY, hh:mm:ss')}`;
              */
  
              // const markerOrder = L.marker([latOrder, lonOrder], { icon: iconOrder });
              // markerOrder.bindPopup(desc);
  
              markers.push(L.circleMarker([latOrder, lonOrder], {
                radius: 2,
                color: colorSeller.get(track.seller)
              }));
                
            });
  
            layerIcons = L.layerGroup(markers);
            layerIcons.addTo(map);        
            map.setView([(maxLat + minLat) / 2, (maxLon + minLon) / 2], zoom);

          }
        })
        .fail((jqxhr, textStatus, error) => {
          const err = textStatus + ", " + error;
          console.log("Request Failed: " + err);
        });
  
        /*     
        map.on('click', function(e){
          var coord = e.latlng;
          var lat = coord.lat;
          var lng = coord.lng;
          console.log(lat + ", " + lng);
        });
        */      
    });
  }
});