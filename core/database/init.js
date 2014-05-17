"use strict";
var path = require('path'),
    config = require('../../config/bot.js'),
    mongoose, tungus, db;

if (config.options.database.type === "tingodb") {
    tungus = require('tungus');
    mongoose = require('mongoose');
    if (config.options.database.url) {
        mongoose.connect('tingodb://' + config.options.database.url, function (err) {
            if (err) throw err;
        });
        db = mongoose.connection;
    } else {
        mongoose.connect('tingodb://' +
            path.resolve(__dirname, '../../database'), function (err) {
                if (err) throw err;
            });
        db = mongoose.connection;
    }
} else if (config.options.database.type === "mongodb") {
    mongoose = require('mongoose');
    mongoose.connect(config.options.database.url, function (err) {
        if (err) throw err;
    });
    db = mongoose.connection;
} else {
    throw config.options.database.type + " database type is not supported.";
}

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("Connected to database.");
});

console.log('Running mongoose version %s', mongoose.version);

module.exports = mongoose;