"use strict";
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    log = require('../privateMethods/log.js');

var method = function (dir) {

    if (fs.existsSync(dir)) {
        var aliases = fs.readFileSync(dir, 'utf8'),
            parsed;
        try {
            parsed = JSON.parse(aliases);
        } catch (err) {
            console.log(err);
            parsed = {};
            fs.writeFileSync(dir, "{}");
        }
        return parsed;

    } else {
        fs.writeFileSync(dir, "{}");
        return {};
    }

};

console.log("Parsing JSON file");


module.exports = method;