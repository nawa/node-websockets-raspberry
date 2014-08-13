var sqlite = require('sqlite3').verbose();
//var db = new sqlite.Database('d:/db.sqlite');
var db = new sqlite.Database(':memory:');

var prepareDatabase = function () {
    db.serialize(function () {
        db.run('CREATE  TABLE  IF NOT EXISTS sensors ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , "temp1" VARCHAR, "temp2" VARCHAR, "door1" VARCHAR, "door2" VARCHAR, "smoke1" VARCHAR, "smoke2" VARCHAR)');
    });
}

var getValues = function (callback) {
    db.get("SELECT * FROM sensors", function (err, row) {
        if (err) return callback(err);
        callback(null, row);
    });
}

var setValues = function (values) {
    db.run('INSERT OR REPLACE INTO sensors (id, temp1, temp2, door1, door2, smoke1, smoke2) values (1, '
        + '"' + values.temp1 + '", '
        + '"' + values.temp2 + '", '
        + '"' + values.door1 + '", '
        + '"' + values.door1 + '", '
        + '"' + values.smoke1 + '", '
        + '"' + values.smoke1 + '")');
}

prepareDatabase();

module.exports.db = db;
module.exports.getValues = getValues;
module.exports.setValues = setValues;