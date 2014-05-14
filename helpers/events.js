"use strict";
var events = require('events'),
    emitter = new events.EventEmitter(),
    fs = require('fs'),
    path = require('path'),
    config = path.resolve(__dirname, "../database/aliases.json");


fs.watchFile(config, function (curr, prev) {
    emitter.emit('configChanged');
    console.log("aliases.json got changed - reloading!");
});



module.exports = emitter;