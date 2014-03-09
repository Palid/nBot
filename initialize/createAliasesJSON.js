"use strict";
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    methods = require('../api/'),
    configDir = path.resolve(__dirname, "../config/aliases.json"),
    config = require('./parseJSON.js');

var method = function (data) {

    for (var property in methods) {

        if (!_.has(data, property)) {
            data[property] = {
                aliases: methods[property].defaults.aliases,
                description: methods[property].defaults.description
            };
        }
    }

    var stringify = JSON.stringify(data, null, 4);

    fs.writeFile(configDir, stringify, function (err) {
        if (err) {
            console.log(err);
        }
    });
};


console.log("Creating aliases.json");

module.exports = method(config);