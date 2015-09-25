var SerialPort = require("serialport").SerialPort;
var EventBus = require("./EventBus");

exports.SerialInterface = SerialInterface;

function SerialInterface(COM, br){
    this.serialPort = new SerialPort(COM, {baudrate: br}, false);
    this.initInterface = function(){
        var sp = this.serialPort;
        sp.open(function(error){
            if(error){
                console.log("failed to open: " + error);
            }
            else{
                console.log(COM + " is open");
                sp.on("data", function(data) {
                    EventBus.sd = data.toString();
                    console.log("data received: " + EventBus.sd);
                    EventBus.dataEmitter.emit("DATARECEIVED");
                });
            }
        });
    };
}
