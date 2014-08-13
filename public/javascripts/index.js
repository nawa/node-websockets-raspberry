(function ($) {
    $(window).load(function () {
        $('#times').on('change', function(evt){
            if(evt.target.value){
                $('#times-label').text(evt.target.value + 's');
            }else{
                alert("Unknown value");
            }
        });

        var socket = io.connect('/');
        socket.on('notification', function (data) {
            $('#temp1').text(data.temp1);
            $('#temp2').text(data.temp2);
            $('#door1').text(data.door1);
            $('#door2').text(data.door2);
            $('#smoke1').text(data.smoke1);
            $('#smoke2').text(data.smoke2);
            $('#console-out').append('<p>' + data.info + '</p>');
            $('#console-out').animate({scrollTop: $('#console-out').prop("scrollHeight")}, 500);
        });
    });
})(jQuery);

