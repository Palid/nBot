"use strict";
var config = require('../../config/bot.js'),
    mongoose, db;

if (config.options.database.type === "mongodb") {
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