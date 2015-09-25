var SerialInterface = require("./SerialInterface").SerialInterface;
var Parser = require("./LCE8102Parser").Parser;
var EventBus = require("./EventBus");
var DbInterface = require("./DbInterface").DbInterface;
var Login = require("./LoginInterface").DbLogin;

var si = new SerialInterface("COM7", 9600);
var parser = new Parser("76523845");
Login("sensorLog");

EventBus.loginEmitter.once("LOGINOK", function(){
    EventBus.conn.once("open", function () {
        var dbInterface = new DbInterface(EventBus.conn);
        EventBus.transEmitter.on("TRANSMIT", function(){
            console.log(EventBus.docs);
            dbInterface.writeIntoDb();
        });
        si.initInterface();
        parser.initParser();
        dbInterface.initInterface();
    });
});