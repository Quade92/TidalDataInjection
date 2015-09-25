var EventEmitter = require("events").EventEmitter;

module.exports = {
    //data bus
    sd: "",
    docs: [],
    dst: {},
    conn: null,
    //signal bus
    dataEmitter: new EventEmitter(),
    parseEmitter: new EventEmitter(),
    transEmitter: new EventEmitter(),
    sorterEmitter: new EventEmitter(),
    loginEmitter: new EventEmitter()
};
