var usage = require("usage");
var io,
    connectionsArray = [],
    pollingTimer;

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
        updateSockets({
            temp1: Math.random(),
            temp2: Math.random(),
            door1: Math.random(),
            door2: Math.random(),
            smoke1: Math.random(),
            smoke2: Math.random(),
            info: "info: " + new Date()
        });
    }
};

var updateSockets = function(data) {
    connectionsArray.forEach(function(socket) {
        socket.volatile.emit('notification', data);
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
        console.log('A new socket is connected!');
    });
};