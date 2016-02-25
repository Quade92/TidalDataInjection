var SerialPort = require("serialport").SerialPort;
var eventBus = require("./bus").eventBus;
var dataBus = require("./bus").dataBus;
var spConfig = require("../config").spConfig;
exports.SerialInterface = SerialInterface;

function SerialInterface(COM, br){
    this.COM = typeof COM!=="undefined" ? COM : spConfig.COM;
    this.br = typeof br!=="undefined" ? br : spConfig.br;
    this.serialPort = new SerialPort(this.COM, {baudrate: this.br}, false);
    this.init = function(){
        var sp = this.serialPort;
        sp.open(function(error){
            if(error){
                console.log("failed to open: " + error);
            }
            else{
                console.log(spConfig.COM + " is open");
                sp.on("data", function(data) {
                    dataBus.sd = data.toString();
                    var d = new Date();
                    console.log(d.toLocaleString()+" - data received: " + dataBus.sd);
                    eventBus.dataEmitter.emit("DATARECEIVED");
                });
            }
        });
    };
}
