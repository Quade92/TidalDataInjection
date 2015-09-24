var EventEmitter = require("events").EventEmitter;

module.exports = {
    sd: "",
    docs: [],
    dataEmitter: new EventEmitter(),
    parseEmitter: new EventEmitter(),
    transEmitter: new EventEmitter(),
    pipeEmitter: new EventEmitter()
};
