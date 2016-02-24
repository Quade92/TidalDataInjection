var eventBus = require("./bus").eventBus;
var dataBus = require("./bus").dataBus;
var parserConfig = require("./config").parserConfig;
exports.Parser = LCE8102Parser;

function LCE8102Parser(sn, mode){
    this.mode = typeof mode !=="undefined" ? mode : parserConfig.mode;
    this.sn = typeof sn !=="undefined" ? sn : parserConfig.sn;
    this.bufferQueue = [];
    this.init = function(){
        eventBus.dataEmitter.on("DATARECEIVED", this.parseRawString.bind(this));
        eventBus.parseEmitter.on("PARSEFINISHED", this.transmitDocuments.bind(this));
    };
    this.parseRawString = function(){
        var entryArray = dataBus.sd.split(";");
        // remove the last empty element ''
        entryArray.splice(-1);
        var documentArray = [];
        for (var entry_index=0; entry_index!=entryArray.length; entry_index++){
            var doc = {
                data: {}
            };
            // schema related
            var now = new Date();
            //var utcTime = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
            //    now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
            doc.data.timestamp = now.getTime();
            doc.data.dtu_id = this.sn;
            doc.data.sensors = {};
            // raw data is seperated by TAB. so the values is seperated by space(s).
            // using regex to split them
            var valueArray = entryArray[entry_index].split(/\s+/);
            for(var value_index=0; value_index!=valueArray.length; value_index++){
                doc.data.sensors["AN"+(value_index+1)] = {};
                doc.data.sensors["AN"+(value_index+1)].label = parserConfig["AN"+(value_index+1)];
                doc.data.sensors["AN"+(value_index+1)].value = parseFloat(valueArray[value_index]);
            }
            documentArray.push(doc);
        }
        if(this.mode=="backward"){
            // rewrite all the timestamp field below
            if(documentArray.length == 1){
                this.bufferQueue.push(documentArray[0]);
            }
            else{
                for(var i1=documentArray.length-2; i1>-1; i1--){
                    documentArray[i1].data.timestamp = documentArray[i1+1].data.timestamp-1000;
                }
                for(var i2=0; i2!=documentArray.length; i2++){
                    this.bufferQueue.push(documentArray[i2]);
                }
            }
            eventBus.parseEmitter.emit("PARSEFINISHED");
        }
        else if(this.mode=="forward"){
            // rewrite all the timestamp field below
            if(documentArray.length == 1){
                this.bufferQueue.push(documentArray[0]);
            }
            else if(this.bufferQueue.length == 0){
                // this is first push and docArray.length>1. timestamps are based on the last doc's timestamp. i.e. backward mode
                // if there's only 1 doc in docArr. for loop is ignored. i.e. no timestamp correction
                for(var i3=documentArray.length-2; i3>-1; i3--){
                    documentArray[i3].data.timestamp = documentArray[i3+1].data.timestamp-1000;
                }
                for(var i4=0; i4!=documentArray.length; i4++){
                    this.bufferQueue.push(documentArray[i4]);
                }
            }
            else{
                // basing on last valid document's (Q head) timestamp
                documentArray[0].data.timestamp = this.bufferQueue[this.bufferQueue.length-1].data.timestamp + 1000;
                this.bufferQueue.push(documentArray[0]);
                for(var i5=1; i5!=documentArray.length; i5++){
                    documentArray[i5].data.timestamp = documentArray[i5-1].data.timestamp + 1000;
                    this.bufferQueue.push(documentArray[i5]);
                }
            }
            eventBus.parseEmitter.emit("PARSEFINISHED");
        }
    };
    this.transmitDocuments = function(){
        var docs = [];
        if(this.mode=="backward"){
            while(this.bufferQueue.length > 0){
                docs.push(this.bufferQueue.shift());
            }
        }
        else if(this.mode=="forward"){
            while(this.bufferQueue.length > 1){
                docs.push(this.bufferQueue.shift());
            }
        }
        if(docs.length != 0){
            dataBus.docs = docs;
            eventBus.transEmitter.emit("TRANSMIT");
        }
    }
}
