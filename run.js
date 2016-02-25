var SerialInterface = require("./app/SerialInterface").SerialInterface;
var Parser = require("./app/LCE8102Parser").Parser;
var eventBus = require("./app/bus").eventBus;
var dataBus = require("./app/bus").dataBus;
var ApiInterface = require("./app/ApiInterface").ApiInterface;
var Login = require("./app/LoginInterface").DbLogin;

var si = new SerialInterface();
var parser = new Parser();
Login();

eventBus.loginEmitter.once("LOGINOK", function(){
    dataBus.conn.once("open", function () {
        var apiInterface = new ApiInterface();
        si.init();
        parser.init();
        apiInterface.init();
    });
});