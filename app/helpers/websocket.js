var usage = require('usage'),
    sensors = require('../dao/sensors'),
    random = require('random-js')();
var io,
    connectionsArray = [],
    pollingTimer;

const DEFAULT_REFRESH_INTERVAL = 3;

var pollingLoop = function() {
    if (connectionsArray.length) {
        pollingTimer = setTimeout(pollingLoop, 1000);
        var pid = process.pid;
        usage.lookup(pid, function(err, result) {
            //unsupported OS
            var info = {};
            if(err){
                info.mem = process.memoryUsage().heapTotal;
            }else{
                info.mem = result.memory;
                info.cpu = result.cpu;
            }
            var clients = getClientsForPush();
            if(clients.length){
            //TODO remove to 1 on prod
            var randomPosition = random.integer(1, 100);
            sensors.getValues(randomPosition, function(err, result){
                if(err) return updateSockets({});
                //TODO unsafe result change. use extend
                result.info = info;
                    updateSockets(getClientsForPush(), result);
                delete result;
            });
            }
        });
    }
};

var updateSockets = function(clients, data) {
    clients.forEach(function(socket) {
        socket.volatile.emit('sensors', data);
    });
};

var getClientsForPush = function(){
    return connectionsArray.filter(function(socket) {
        var refreshInterval = DEFAULT_REFRESH_INTERVAL;
        if(socket.refreshInterval){
            refreshInterval = socket.refreshInterval;
        }
        return new Date().getSeconds() % refreshInterval == 0;
    });
        }

module.exports.listen = function (app) {
    io = require('socket.io')(app);
    io.sockets.on('connection', function(socket) {
        console.log('Number of connections:' + connectionsArray.length);
        var onStart = connectionsArray.length == 0;
        connectionsArray.push(socket);
        if (onStart) {
            if(pollingTimer){
                clearTimeout(pollingTimer);
            }
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