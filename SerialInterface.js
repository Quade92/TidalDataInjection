var SerialPort = require("serialport").SerialPort;
var EventEmitter = require("events").EventEmitter;

var dataEmitter = new EventEmitter();
exports.dataEmitter = dataEmitter;

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
                    dataEmitter.emit("DataReceived", data);
                });
            }
        });
    };
}