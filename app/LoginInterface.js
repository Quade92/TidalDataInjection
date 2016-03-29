var mongoose = require("mongoose");
var prompt = require("prompt");
var request = require("request");
var eventBus = require("./bus").eventBus;
var dataBus = require("./bus").dataBus;
var dbConfig = require("../config").dbConfig;

function DbLogin() {
    // default { ip : localhost, port : 27999 }
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
        request({
                method: 'POST',
                url: "http://localhost:5000/authenticate",
                json: {
                    "un": result.username,
                    "pwd": result.password
                }
            },
            function (error, response, body) {
                var d = new Date();
                if (!error && response.statusCode == 200) {
                    console.log(d.toLocaleString() + " - SUCCESS: " + body.message);
                }
                else {
                    console.log(d.toLocaleString() + " - ERROR: " + error);
                }
                mongoose.connect("mongodb://@" + dbConfig.host + ":" + dbConfig.port + "/" + dbConfig.db, function (err) {
                    if (err) {
                        console.log(err);
                        return mongoose.connection;
                    }
                    console.log("mongodb connection status: " + mongoose.connection.readyState);
                    dataBus.conn = mongoose.connection;
                    dataBus.token = body.result.token;
                    eventBus.loginEmitter.emit("LOGINOK");
                });
            });
    });
}

exports.DbLogin = DbLogin;
