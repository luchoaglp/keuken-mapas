$(function() {

    $('#submit').click(function() {
        const user = $('#user').val();
        const password = $('#password').val();
        
        if(String(CryptoJS.MD5(user + password)) === '08ed4c6f91c0157eee09e0e3dd55b88c') {
            Cookie.setCookie('user', 'Keuken');
            Cookie.setCookie('enterprise', 10010033);

            $(location).attr('href','./leaflet/sellerroute.html');
        }
    });

});