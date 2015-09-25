var EventBus = require("./EventBus");
exports.Parser = LCE8102Parser;

function LCE8102Parser(SN){
    this.sn = SN;
    this.bufferQueue = [];
    this.initParser = function(){
        EventBus.dataEmitter.on("DATARECEIVED", this.parseRawString.bind(this));
        EventBus.parseEmitter.on("PARSEFINISHED", this.transmitDocuments.bind(this));
    };
    this.parseRawString = function(){
        var entryArray = EventBus.sd.split(";");
        // remove the last empty element ''
        entryArray.splice(-1);
        var documentArray = [];
        for (var entry_index=0; entry_index!=entryArray.length; entry_index++){
            var doc = {};
            // schema related
            doc.timestamp = Date.now();
            doc.dtu_id = this.sn;
            doc.sensors = [];
            // raw data is seperated by TAB. so the values is seperated by space(s).
            // using regex to split them
            var valueArray = entryArray[entry_index].split(/\s+/);
            for(var value_index=0; value_index!=valueArray.length; value_index++){
                doc.sensors.push(
                    {
                        name:"AN"+(value_index+1).toString(),
                        // string to number transform
                        value: parseFloat(valueArray[value_index])
                    });
            }
            documentArray.push(doc);
        }
        // rewrite all the timestamp field below
        if(documentArray.length == 1){
            this.bufferQueue.push(documentArray[0]);
        }
        else if(this.bufferQueue.length == 0){
            // this is first push. timestamps are based on the last doc's timestamp
            // if there's only 1 doc in docArr. for loop is ignored. i.e. no timestamp correction
            for(var back_doc_index=documentArray.length-2; back_doc_index>0; back_doc_index--){
                documentArray[back_doc_index].timestamp = documentArray[back_doc_index+1].timestamp-1;
            }
            for(var doc_index=0; doc_index!=documentArray.length; doc_index++){
                this.bufferQueue.push(documentArray[doc_index]);
            }
        }
        else{
            // basing on last valid document's (Q head) timestamp
            documentArray[0].timestamp = this.bufferQueue[this.bufferQueue.length-1].timestamp + 1;
            this.bufferQueue.push(documentArray[0]);
            for(doc_index=1; doc_index!=documentArray.length; doc_index++){
                documentArray[doc_index].timestamp = documentArray[doc_index-1].timestamp + 1;
                this.bufferQueue.push(documentArray[doc_index]);
            }
        }
        EventBus.parseEmitter.emit("PARSEFINISHED");
    };
    this.transmitDocuments = function(){
        var docs = [];
        while(this.bufferQueue.length > 1){
            docs.push(this.bufferQueue.shift());
        }
        if(docs.length != 0){
            EventBus.docs = docs;
            EventBus.transEmitter.emit("TRANSMIT", EventBus.docs);
        }
    }
}
