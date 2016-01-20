var EventEmitter = require("events").EventEmitter;

eventBus = {
    dataEmitter: new EventEmitter(),
    parseEmitter: new EventEmitter(),
    transEmitter: new EventEmitter(),
    loginEmitter: new EventEmitter()
};

dataBus = {
    auth: "",
    sd: "",
    docs: [],
    conn: null
};

exports.eventBus = eventBus;
exports.dataBus = dataBus;