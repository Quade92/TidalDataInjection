var SerialPort = require("serialport").SerialPort;

var serialPort = new SerialPort("COM7", {
    baudrate: 9600
}, false); // this is the openImmediately flag [default is true]

serialPort.open(function (error) {
    if ( error ) {
        console.log('failed to open: '+error);
    } else {
        console.log('open');
        serialPort.on('data', function(data) {
            //var serialData = JSON.parse(data);
            //console.log('data received: ' + COMPaser(data,"json context"));
            console.log("data received: " + data);
        });
    }
});