'use strict';
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    log = require('../privateMethods/log.js'),
    config = path.resolve(__dirname, "../config/aliases.json");

var method = function (dir) {

    if (fs.existsSync(dir)) {
        var aliases = fs.readFileSync(dir, 'utf8'),
            parsed;

        try {
            parsed = JSON.parse(aliases);
        } catch (err) {
            console.log(err);
            parsed = {};
            fs.writeFileSync(config, "{}");
        }
        return parsed;

    } else {
        fs.writeFileSync(config, "{}");
        return {};
    }

};

console.log("Parsing JSON file");

var parsedConfig = method(config);


module.exports = parsedConfig;