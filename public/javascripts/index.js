(function ($) {
    $(window).load(function () {
        var socket = io.connect('/');
        socket.on('sensors', function (data) {
            $('#temp1').text(data.temp1);
            $('#temp2').text(data.temp2);
            $('#door1').text(data.door1);
            $('#door2').text(data.door2);
            $('#smoke1').text(data.smoke1);
            $('#smoke2').text(data.smoke2);
            var logMessage = '';
            if(data.info.time){
                logMessage += 'Time: ' + data.info.time + '; ';
            }

            if(data.info.cpu){
                var value = parseFloat(data.info.cpu);
                value = Math.round(value * 100) / 100;
                logMessage += 'CPU: ' + value + '%; ';
            }
            if(data.info.mem){
                var value = parseInt(data.info.mem);
                value = Math.floor(value / 1024);
                logMessage += 'Memory: ' + (value + '').replace(/\B(?=(\d{3})+(?!\d))/g, " ") + 'Kb; ';
            }
            $('#console-out').append('<p>' + logMessage + '</p>');
            if($('#console-out').children().size() > 100){
                $('#console-out p:first').remove();
            }
            $('#console-out').animate({scrollTop: $('#console-out').prop("scrollHeight")}, 500);
        });

        $('#times').on('change', function(evt){
            if(evt.target.value){
                $('#times-label').text(evt.target.value + 's');
                socket.emit('updateRefreshInterval', evt.target.value);
            }else{
                alert("Unknown value");
            }
        });
    });
})(jQuery);

