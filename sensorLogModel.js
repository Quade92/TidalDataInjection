var mongoose = require("mongoose");

var sensorLogSchema = new mongoose.Schema({
    timestamp: Number,
    sensors: [
        {
            name: String,
            value: Number
        }
    ]
});

module.exports = mongoose.model("SensorLog", sensorLogSchema);