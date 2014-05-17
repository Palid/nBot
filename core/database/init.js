"use strict";
var path = require('path'),
    config = require('../../config/bot.js'),
    mongoose, tungus;

if (config.options.database.type === "tingodb") {
    tungus = require('tungus');
    mongoose = require('mongoose');
    if (config.options.database.url) {
        mongoose.connect('tingodb://' + config.options.database.url, function (err) {
            if (err) throw err;
        });
    } else {
        mongoose.connect('tingodb://' +
            path.resolve(__dirname, '../../database'), function (err) {
                if (err) throw err;
            });
    }
} else if (config.options.database.type === "mongodb") {
    mongoose = require('mongoose');
    mongoose.connect(config.options.database.url, function (err) {
        if (err) throw err;
    });
} else {
    throw config.options.database.type + " database type is not supported.";
}

console.log('Running mongoose version %s', mongoose.version);

module.exports = mongoose;