var mongoose = require("mongoose");

exports.model = mongoose.model("SensorLog", sensorLogSchema);

var sensorLogSchema = new mongoose.Schema({
    timestamp: Number,
    dtu_id: Number,
    sensors: [
        {
            name: String,
            value: Number
        }
    ]
});