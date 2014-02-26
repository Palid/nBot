"use strict";
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    methods = require('../publicMethods/'),
    config = require('./parseJSON.js'),
    configDir = path.resolve(__dirname, "../config/aliases.json");

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

method(config);