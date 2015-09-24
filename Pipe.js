var EventBus = require("./EventBus");

function Pipe(db, collection){
    this.dst = {
        dbname:db,
        colName:collection
    };
    this.initPipe = function(){
        EventBus.parseEmitter.on("transmit", pipeout(docs));
    };
    this.pipeout = function(docs){
        EventBus.pipeEmitter.emit("pipeout", this.dst, docs);
    }
}
