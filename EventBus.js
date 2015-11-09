var EventEmitter = require("events").EventEmitter;

module.exports = {
    //data bus
    sd: "",
    docs: [],
    dst: {},
    conn: null,
    mode: "backward",
    //signal bus
    dataEmitter: new EventEmitter(),
    parseEmitter: new EventEmitter(),
    transEmitter: new EventEmitter(),
    loginEmitter: new EventEmitter()
};
