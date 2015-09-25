var EventBus = require("./EventBus");

exports.sorter = Sorter;

function Sorter(db, collection){
    this.dst = {
        dbName: db,
        colName: collection
    };
    this.initSorter = function(){
        EventBus.transEmitter.on("TRANSMIT", this.sortOut.bind(this));
    };
    this.sortOut = function(){
        EventBus.dst = this.dst;
        EventBus.sorterEmitter.emit("SORTOUT");
    }
}
