var SerialPort = require("serialport").SerialPort;
var EventBus = require("./EventBus");

function SerialInterface(COM, br){
    this.serialPort = SerialPort(COM, {baudrate: br}, false);
    this.initInterface = function(){
        serialPort.open(function(error){
            if(error){
                console.log("failed to open: " + error);
            }
            else{
                console.log(COM.toString()+" is open");
                serialPort.on("data", function(data) {
                    console.log("data received: " + data);
                    EventBus.dataEmitter.emit("DataReceived", data);
                });
            }
        });
    };
}