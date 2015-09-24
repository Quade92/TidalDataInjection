var EventEmitter = require("events").EventEmitter;

module.exports = {
    dataEmitter: new EventEmitter(),
    parseEmitter: new EventEmitter(),
    transEmitter: new EventEmitter(),
    pipeEmitter: new EventEmitter()
};
