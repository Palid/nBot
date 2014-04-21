"use strict";
var fs = require('fs'),
    path = require('path'),
    events = require('events'),
    config = path.resolve(__dirname, "../config/aliases.json"),
    emitter = new events.EventEmitter();

function main(curr, prev) {
    emitter.emit('configChanged');

    console.log("aliases.json got changed - reloading!");
}


fs.watchFile(config, function (curr, prev) {
    main(curr, prev);
});

module.exports = emitter;