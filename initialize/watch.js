"use strict";
var fs = require('fs'),
    path = require('path'),
    events = require('events'),
    _ = require('lodash'),
    log = require('../privateMethods/log.js'),
    config = path.resolve(__dirname, "../config/aliases.json"),
    evt = new events.EventEmitter();


fs.watchFile(config, function (curr, prev) {

    evt.emit('configChanged');

    console.log("aliases.json got changed - reloading!");

    log(false,
        "fileChanges",
        'the current mtime is: ' + curr.mtime + '\r\n' +
        'the previous mtime was: ' + prev.mtime + '\r\n' +
        '**************************************************' + '\r\n');


});

module.exports = evt;