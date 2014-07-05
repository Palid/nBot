"use strict";
var rek = require('rekuire');
var bot = rek('/bot.js');
var config = bot.getOption('database'),
    mongoose, db;

if (config.type === "mongodb") {
    mongoose = require('mongoose');
    mongoose.connect(config.url, {
            user: config.login || undefined,
            pass: config.password || undefined
        },
        function (err) {
            if (err) throw err;
        });
    db = mongoose.connection;
} else {
    throw config.type + " database type is not supported.";
}

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("Connected to database.");
});

console.log('Running mongoose version %s', mongoose.version);