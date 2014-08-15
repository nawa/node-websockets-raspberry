var sqlite = require('sqlite3').verbose();
//var db = new sqlite.Database('d:/db.sqlite');
var db = new sqlite.Database(':memory:');

var prepareDatabase = function () {
    db.run('CREATE  TABLE  IF NOT EXISTS sensors ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , "temp1" VARCHAR, "temp2" VARCHAR, "door1" VARCHAR, "door2" VARCHAR, "smoke1" VARCHAR, "smoke2" VARCHAR)');
}

var getValues = function (position, callback) {
    db.get("SELECT * FROM sensors WHERE id=" + position, function (err, row) {
        if (err) return callback(err);
        callback(null, row);
    });
}

var setValues = function (values) {
    db.run('INSERT OR REPLACE INTO sensors (id, temp1, temp2, door1, door2, smoke1, smoke2) values (1, '
        + '"' + values.temp1 + '", '
        + '"' + values.temp2 + '", '
        + '"' + values.door1 + '", '
        + '"' + values.door2 + '", '
        + '"' + values.smoke1 + '", '
        + '"' + values.smoke2 + '")');
}

var addValues = function (values) {
    db.run('INSERT INTO sensors (temp1, temp2, door1, door2, smoke1, smoke2) values ('
        + '"' + values.temp1 + '", '
        + '"' + values.temp2 + '", '
        + '"' + values.door1 + '", '
        + '"' + values.door2 + '", '
        + '"' + values.smoke1 + '", '
        + '"' + values.smoke2 + '")');
}

var cleanValues = function (values) {
    db.serialize(function () {
        db.run('DROP TABLE sensors');
        prepareDatabase();
    });
}

prepareDatabase();

module.exports.db = db;
module.exports.getValues = getValues;
module.exports.setValues = setValues;
module.exports.addValues = addValues;
module.exports.cleanValues = cleanValues;