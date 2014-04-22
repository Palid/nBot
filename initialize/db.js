"use strict";
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    client = require('../config/bot.js'),
    db = path.resolve(__dirname, '../database/db.json'),
    data;

// Try to parse JSON
try {
    data = JSON.parse(fs.readFileSync(db, 'utf8'));
} catch (err) {
    console.log(err);
    data = {};
}

// Generate entries for each channel
_.forEach(client.opt.channels, function (property, key) {
    if (!data[property]) data[property] = {};
    if (!data[property].users) data[property].users = {};
    if (!data[property].links) data[property].links = {};
});

// Save the base instantly
fs.writeFile(db, JSON.stringify(data, null, 4), function (err) {
    console.log(err);
});


// Write data to file every minute.
setInterval(function () {
    fs.writeFile(db, JSON.stringify(data, null, 4), function (err) {
        console.log(err);
    });
}, 60000);

module.exports = data;