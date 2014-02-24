/*jslint node: true */
'use strict';
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    log = require('./log.js'),
    config = path.resolve(__dirname, "../config/aliases.json");

var method = function (dir) {
    console.log(Date.now());
    console.log("used!");

    var aliases = fs.readFileSync(dir, 'utf8'),
        parsed = JSON.parse(aliases);


    return parsed;
};

var parsedConfig = method(config);

fs.watchFile(config, function (curr, prev) {
    log(false,
        "fileChanges",
        'the current mtime is: ' + curr.mtime + '\r\n' +
        'the previous mtime was: ' + prev.mtime + '\r\n' +
        '**************************************************');
    parsedConfig = method(config);
});


module.exports = parsedConfig;