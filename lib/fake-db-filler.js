var sensors = require('./sensor-dao');

var init = function(timeout){
    putNewValues(timeout);
}
var putNewValues = function(timeout){
    sensors.setValues({
        temp1: Math.random(),
        temp2: Math.random(),
        door1: Math.random(),
        door2: Math.random(),
        smoke1: Math.random(),
        smoke2: Math.random()
    });
    setTimeout(putNewValues, timeout);
}

module.exports = init;

