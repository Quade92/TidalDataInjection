var mongoose = require("mongoose");
var prompt = require("prompt");
var eventBus = require("./bus").eventBus;
var dataBus = require("./bus").dataBus;
var dbConfig = require("./config").dbConfig;

function DbLogin(db, host, port) {
    // default { ip : localhost, port : 27999 }
    this.ip = typeof host !== "undefined" ? host : dbConfig.host;
    this.port = typeof port !== "undefined" ? port : dbConfig.port;
    this.db = typeof db!=="undefined" ? db : dbConfig.db;
    prompt.start();
    var schema = {
        properties: {
            username: {
                required: true
            },
            password: {
                hidden: true
            }
        }
    };
    prompt.get(schema, function (err, result) {
        if (err) {
            console.log("Error: " + err);
            return mongoose.connection;
        }
        mongoose.connect("mongodb://" + result.username + ":" + result.password +
            "@" + this.ip + ":" + this.port + "/" + this.db, function (err) {
            if (err) {
                console.log(err);
                return mongoose.connection;
            }
            console.log("mongodb connection status: "+mongoose.connection.readyState);
            dataBus.conn = mongoose.connection;
            dataBus.auth = "Basic " + new Buffer(result.username+":"+result.password).toString("base64");
            eventBus.loginEmitter.emit("LOGINOK");
        });
    });
}

exports.DbLogin = DbLogin;
