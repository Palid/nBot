"use strict";
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    // loadDir = require('../../../helpers/loadDirectory.js'),
    config = require('../../../config/bot.js'),
    db = path.resolve(__dirname, '../../../database/db.json'),
    data;

// TODO
// Create this damn database.

// var b = loadDir('../../database', {
//     currentDir: __dirname,
//     type: 'json',
//     maxDepth: 2
// });

// Try to parse JSON
try {
    data = JSON.parse(fs.readFileSync(db, 'utf8'));
} catch (err) {
    console.log(err);
    data = {};
}

if (!data.channels) data.channels = {};
if (!data.users) data.users = {};

// Generate entries for each channel
_.forEach(config.irc.channels, function (property, key) {
    var propertyLower = property.toLowerCase();
    if (!data.channels[propertyLower]) data.channels[propertyLower] = {};
    if (!data.channels[propertyLower].users) data.channels[propertyLower].users = {};
    if (!data.channels[propertyLower].links) data.channels[propertyLower].links = {};
});

module.exports = data;