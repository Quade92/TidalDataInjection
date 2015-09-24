var serialInterface = require("./SerialInterface");
var EventEmitter = require("events").EventEmitter;

var parseEmitter = EventEmitter();
var transEmitter = EventEmitter();
exports.transEmitter = transEmitter;

function LCE8102Parser(SN){
    this.sn = SN;
    this.bufferQueue = [];
    this.initParser = function(){
        serialInterface.dataEmitter.on("DataReceived", this.parseRawString(rs));
        parseEmitter.on("ParseFinished", this.transmitDocuments);
    };
    this.parseRawString = function(rs){
        var entryArray = rs.split(";");
        // remove the last empty element ''
        entryArray.splice(-1);
        var documentArray = [];
        // entry is raw string from serial port splited by ";"
        // i.e. return value of sliceDocuments
        for (entry in entryArray){
            var doc = {};
            // schema related
            doc.timestamp = Date.now();
            doc.dtu_id = this.sn;
            doc.sensors = [];
            // raw data is seperated by TAB. so the values is seperated by space(s).
            // using regex to split them
            var valueArray = entry.split(/\s+/);
            for(i=0; i!=valueArray.length; i++){
                doc.sensors.push(
                    {
                        name:"AN"+(i+1).toString(),
                        // string to number transform
                        value: parseFloat(valueArray[i])
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
            // if there's only 1 doc in docArr. for loop is jumped. i.e. no timestamp correction
            for(i=documentArray.length-2; i>0; i--){
                documentArray[i].timestamp = documentArray[i+1].timestamp-1;
            }
            for(doc in documentArray){
                this.bufferQueue.push(doc);
            }
        }
        else{
            // basing on last valid document's (Q head) timestamp
            documentArray[0].timestamp = this.bufferQueue[this.bufferQueue.lenth-1].timestamp + 1;
            this.bufferQueue.push(documentArray[0]);
            for(i=1; i!=documentArray.length; i++){
                documentArray[i].timestamp = documentArray[i-1].timestamp + 1;
                this.bufferQueue.push(documentArray[i]);
            }
        }
        parseEmitter.emit("ParseFinished");
    };
    this.transmitDocuments = function(){
        var docs = [];
        while(this.bufferQueue.length > 1){
            docs.push(this.bufferQueue.shift());
        }
        if(docs.length != 0){
            transEmitter.emit("transmit", docs);
        }
    }
}
