var usage = require('usage'),
    sensors = require('./sensor-dao');
var io,
    connectionsArray = [],
    pollingTimer;

const DEFAULT_REFRESH_INTERVAL = 3;

var pollingLoop = function() {
    if (connectionsArray.length) {
        pollingTimer = setTimeout(pollingLoop, 1000);
        /*var pid = process.pid;
        usage.lookup(pid, function(err, result) {
            updateSockets({
                temp1: Math.random(),
                temp2: Math.random(),
                door1: Math.random(),
                door2: Math.random(),
                smoke1: Math.random(),
                smoke2: Math.random(),
                info:{
                    mem: result.memory,
                    cpu: result.cpu
                }
            });
        });*/
        sensors.getValues(function(err, result){
            if(err) return updateSockets({});
            //TODO unsafe result change. use extend
            result.info = "info: " + new Date();
            updateSockets(result);
        });
    }
};

var updateSockets = function(data) {
    connectionsArray.forEach(function(socket) {
        var refreshInterval = DEFAULT_REFRESH_INTERVAL;
        if(socket.refreshInterval){
            refreshInterval = socket.refreshInterval;
        }
        if(new Date().getSeconds() % refreshInterval == 0){
            socket.volatile.emit('notification', data);
        }
    });
};

module.exports.listen = function (app) {
    io = require('socket.io')(app);
    io.sockets.on('connection', function(socket) {
        console.log('Number of connections:' + connectionsArray.length);
        var onStart = connectionsArray.length == 0;
        connectionsArray.push(socket);
        if (onStart) {
            pollingLoop();
        }

        socket.on('disconnect', function() {
            var socketIndex = connectionsArray.indexOf(socket);
            console.log('socket = ' + socketIndex + ' disconnected');
            if (socketIndex >= 0) {
                connectionsArray.splice(socketIndex, 1);
            }
        });
        (function (socket) {
            socket.on('updateRefreshInterval', function(interval){
                socket.refreshInterval = interval;
                console.log('interval is updated')
            });
        })(socket);

        console.log('A new socket is connected!');
    });
};