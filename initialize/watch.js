"use strict";
var fs = require('fs'),
    path = require('path'),
    events = require('events'),
    log = require('../helpers/log.js'),
    config = path.resolve(__dirname, "../config/aliases.json"),
    emitter = new events.EventEmitter();

function main(curr, prev) {
    emitter.emit('configChanged');

    console.log("aliases.json got changed - reloading!");

    log(false,
        "fileChanges",
        'the current mtime is: ' + curr.mtime + '\r\n' +
        'the previous mtime was: ' + prev.mtime + '\r\n' +
        '**************************************************' + '\r\n');
}


fs.watchFile(config, function (curr, prev) {
    main(curr, prev);
});

module.exports = emitter;