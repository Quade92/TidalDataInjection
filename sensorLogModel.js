var mongoose = require("mongoose");

var sensorLogSchema = new mongoose.Schema(
    {
        timestamp: Number,
        dtu_id: Number,
        sensors: [
            {
                name: String,
                value: Number
            }
        ]
    },
    {
        collection: "sensorlogs",
        versionKey:false
    }
);

exports.model = mongoose.model("SensorLog", sensorLogSchema);
