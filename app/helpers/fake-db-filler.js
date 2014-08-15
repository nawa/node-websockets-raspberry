var sensors = require('../dao/sensors'),
    Random = require("random-js"),
    random = new Random(Random.engines.mt19937().autoSeed());

var init = function(timeout){
    sensors.cleanValues();
    for(var i = 0; i < 100; i++){
      sensors.addValues({
          temp1: random.integer(-50, 50),
          temp2: random.integer(-50, 50),
          door1: random.bool() ? 'Open' : 'Closed',
          door2: random.bool() ? 'Open' : 'Closed',
          smoke1: random.bool() ? 'OK' : 'ALARM',
          smoke2: random.bool() ? 'OK' : 'ALARM'
      });
    }
    //putNewValues(timeout);
}
/*var putNewValues = function(timeout){
    sensors.setValues({
        temp1: Math.random(),
        temp2: Math.random(),
        door1: Math.random(),
        door2: Math.random(),
        smoke1: Math.random(),
        smoke2: Math.random()
    });
    setTimeout(putNewValues, timeout);
}*/

module.exports = init;

