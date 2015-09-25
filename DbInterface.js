var EventBus = require("./EventBus");
var model = require("./sensorLogModel").model;

exports.DbInterface = DbInterface;

function DbInterface(conn){
    this.conn = conn;
    console.log("flag");
    this.initInterface = function(){
        // ensures when saving docs, the connection is established
        if(this.conn.readyState==1){
            console.log("the connection is established");
            EventBus.sorterEmitter.on("TRANSMIT", this.writeIntoDb.bind(this));
        }
    };
    this.writeIntoDb = function(){
        for(var document_index=0; document_index!=EventBus.docs.length; document_index++){
            var sensorLog = new model(EventBus.docs[document_index]);
            sensorLog.save();
        }
    };
}
