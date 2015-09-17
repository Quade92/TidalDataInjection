var sensorLogModel = require("./sensorLogModel.js");

var insertSensorLog = function(){
    // TODO this is a test version
    var sensorLog = new sensorLogModel({
        timestamp: Date.now(),
        sensors: [
            {
                name: "AN1",
                value: Math.random()*2+3.0
            },
            {
                name: "AN2",
                value: Math.random()*2+3.0
            },
            {
                name: "AN3",
                value: Math.random()*2+3.0
            },
            {
                name: "AN4",
                value: Math.random()*2+3.0
            },
            {
                name: "AN5",
                value: Math.random()*2+3.0
            },
            {
                name: "AN6",
                value: Math.random()*2+3.0
            }
        ]
    });
    sensorLog.save(function(err){
        if (err){
            console.log(err);
        }
    });
};

module.exports = {
    insertSensorLog: insertSensorLog
};