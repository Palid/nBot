"use strict";
var fs = require('fs'),
    path = require('path'),
    config = path.resolve(__dirname, "../database/aliases.json"),
    emitter = require('./index.js');

function main(curr, prev) {
    emitter.emit('configChanged');

    console.log("aliases.json got changed - reloading!");
}


fs.watchFile(config, function (curr, prev) {
    main(curr, prev);
});

module.exports = emitter;