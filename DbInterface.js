var EventBus = require("./EventBus");
var model = require("./sensorLogModel").model;

exports.DbInterface = DbInterface;

function DbInterface(){
    this.initInterface = function(){
        // ensures when saving docs, the connection is established
        if(EventBus.conn.readyState==1){
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
