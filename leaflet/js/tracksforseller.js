$(function() {

  const params = new URLSearchParams(window.location.search);
  
  if(params.has('enterprise')) {
  
    const enterprise = parseInt(params.get('enterprise'));
  
    $.getJSON(`http://keu.webhop.org:8991/getusersforenterprise?enterprise=${enterprise}&tracking=1`, { })
    // $.getJSON(`./js/sellers.json`, { })
      .done(function(data) {
  
        sellers = data;
  
        $('.mdb-select').materialSelect();
  
        Date.prototype.toDateInputValue = (function() {
          let local = new Date(this);
          local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
          return local.toJSON().slice(0, 10);
        });
  
        const today = new Date().toDateInputValue();
  
        $from = $('#from');
        $to = $('#to');
        $sellerSelect = $('#seller-select');
        $mapSelect = $('#map-select');
        $btnSubmit = $('#btn-submit');
        $seller = $('#seller');
        $fromSelected = $('#from-selected');
        $toSelected = $('#to-selected');
        $quantity = $('#quantity');
        let from = today;
        let to = today;
        let seller;
        let sellerName;
  
        let mapLayerIndex = 0;
        const zoom = 14;
  
        const map = L.map('map', {
          preferCanvas: true
        });
  
        tilesLayer[mapLayerIndex].addTo(map);
  
        $from.val(today);
        $to.val(today);
  
        $fromSelected.text(today);
        $toSelected.text(today);
  
        let layerIcons;
        let markers = [];
  
        sellers.forEach(seller => {
          $sellerSelect.append(`<option value="${seller.id}">${seller.name}</option>`);
        });
  
        function reset() {
          markers = [];
            if(layerIcons) {
              map.removeLayer(layerIcons);
            }
        }
  
        $from.change(function() {
          from = $(this).val();
          $fromSelected.text(from);
        });
  
        $to.change(function() {
          to = $(this).val();
          $toSelected.text(to);
        });
  
        $sellerSelect.change(function() {;
          const $sellerSelected = $sellerSelect.find(':selected');
          seller = $sellerSelected.val();
          sellerName = $sellerSelected.text();
          $seller.text(sellerName);
        });
  
        $mapSelect.change(function() {
          map.removeLayer(tilesLayer[mapLayerIndex]);
          mapLayerIndex = parseInt($(this).find(':selected').val());
          tilesLayer[mapLayerIndex].addTo(map);
        });
  
        $btnSubmit.click(function() {
    
          reset();
                  
          seller = $sellerSelect.val();
                  
          if(seller !== null) {
                      
            $.getJSON(`http://keu.webhop.org:8991/gettracksforseller?enterprise=${enterprise}&seller=${seller}&fromdate=${from}&untildate=${to}`, { })
            // $.getJSON(`./js/seller105.json`, { })
  
              .done(tracks => {
  
                $quantity.text(tracks.length);
  
                if(tracks.length > 0) {
  
                  /*
                  let minLat = -Infinity;
                  let minLon = -Infinity;
                  let maxLat = Infinity;
                  let maxLon = Infinity;
                  */
  
                  /*
                  const iconOrder = L.icon({
                    iconUrl: './img/circle.svg',
                    iconSize: [10, 10],
                    iconAnchor: [0, 0],
                    popupAnchor: [0, 0]
                    });
                  */

                  let firstLatOrder = tracks[0].latitud_order;
                  let firstLonOrder = tracks[0].longitud_order;
  
                  tracks.forEach(track => {
  
                    const latOrder = parseFloat(track.latitud_order);
                    const lonOrder = parseFloat(track.longitud_order);
  
                    /*
                    minLat = latOrder > minLat ? latOrder : minLat;
                    minLon = lonOrder > minLon ? lonOrder : minLon;
                    maxLat = latOrder < maxLat ? latOrder : maxLat;
                    maxLon = lonOrder < maxLon ? lonOrder : maxLon;
                    */
  
                    /*
                    const desc = `<h5></h5>
                      <p>${ moment(track.date).format('DD/MM/YYYY, hh:mm:ss')}`;
                    */
  
                    // const markerOrder = L.marker([latOrder, lonOrder], { icon: iconOrder });
                    // markerOrder.bindPopup(desc);
  
                    markers.push(L.circleMarker([latOrder, lonOrder], {
                      radius: 2,
                      color: '#FF0000'
                    }));
  
                    //markers.push(markerOrder);
                  });
  
                  layerIcons = L.layerGroup(markers);
                  layerIcons.addTo(map);
  
                  // const distMaxMin = L.latLng(maxLat, maxLon).distanceTo(L.latLng(minLat, minLon));
                              
                  // map.setView([(maxLat + minLat) / 2, (maxLon + minLon) / 2], zoom);
                  map.setView([firstLatOrder, firstLonOrder], zoom);
                }
  
              }).fail((jqxhr, textStatus, error) => {
                const err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
              });
  
              /*     
              map.on('click', function(e){
                const coord = e.latlng;
                const lat = coord.lat;
                const lng = coord.lng;
                console.log(lat + ", " + lng);
              });
              */      
          }
        });
  
      }).fail((jqxhr, textStatus, error) => {
          const err = textStatus + ", " + error;
          console.log("Request Failed: " + err);
      });
  }
});