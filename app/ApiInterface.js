var eventBus = require("./bus").eventBus;
var dataBus = require("./bus").dataBus;
var request = require("request");
var apiConfig = require("./config").apiConfig;

exports.ApiInterface = PushToDbApi;

function PushToDbApi(host, port, path) {
    this.host = typeof host!=="undefined" ? host : apiConfig.host;
    this.port = typeof port!=="undefined" ? port : apiConfig.port;
    this.path = typeof path!=="undefined" ? path : apiConfig.path;
    this.url = "http://" + this.host + ":" + this.port + this.path;
    this.auth = dataBus.auth;
    this.init = function () {
        // ensures when saving docs, the connection is established
        if (dataBus.conn.readyState == 1) {
            eventBus.transEmitter.on("TRANSMIT", this.pushToApi.bind(this));
        }
    };
    this.pushToApi = function () {
        for (var i = 0; i != dataBus.docs.length; i++) {
            request({
                    method: 'POST',
                    url: this.url,
                    headers: {
                        "Authorization": this.auth
                    },
                    json: dataBus.docs[i]
                },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var d = new Date();
                        console.log(d.toLocaleString()+" - "+body.message);
                    }
                    else {
                        console.log(error);
                    }
                });
        }
    };
}
