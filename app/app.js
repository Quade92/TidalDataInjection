var SerialInterface = require("./SerialInterface").SerialInterface;
var Parser = require("./LCE8102Parser").Parser;
var eventBus = require("./bus").eventBus;
var dataBus = require("./bus").dataBus;
var ApiInterface = require("./ApiInterface").ApiInterface;
var Login = require("./LoginInterface").DbLogin;

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