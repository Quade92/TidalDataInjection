var mongoose = require("mongoose");
var prompt = require("prompt");
var EventBus = require("./EventBus");

function DbLogin(dbName, ip, port) {
    // default { ip : localhost, port : 27999 }
    ip = typeof ip !== "undefined" ? ip : "localhost";
    port = typeof port !== "undefined" ? port : "27999";
    prompt.start();
    prompt.get(['username', 'password'], function (err, result) {
        if (err) {
            console.log("Error: " + err);
            return mongoose.connection;
        }
        mongoose.connect("mongodb://" + result.username + ":" + result.password +
            "@" + ip + ":" + port + "/" + dbName, function (err) {
            if (err) {
                console.log(err);
                return mongoose.connection;
            }
            console.log("mongodb connection status: "+mongoose.connection.readyState);
            EventBus.conn = mongoose.connection;
            EventBus.loginEmitter.emit("LOGINOK");
        });
    });
}

exports.DbLogin = DbLogin;
