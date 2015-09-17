var mongoose = require("mongoose");

var getSensorLogModel = function(){
    var sensorLogSchema = new mongoose.Schema({
        timestamp: Number,
        sensors: [
            {
                name: String,
                value: Number
            }
        ]
    });
    return mongoose.model("SensorLog", sensorLogSchema);
};

var insertSensorLog = function(){
    // TODO this is a test version
    var sensorLogModel = getSensorLogModel();
    var sensorLog = new sensorLogModel({
        timestamp: 1,
        sensors: [
            {
                name: "AN1",
                value: "3.14125"
            },
            {
                name: "AN2",
                value: "6.28250"
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
    getSensorLogModel: getSensorLogModel,
    insertSensorLog: insertSensorLog
};