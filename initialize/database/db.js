"use strict";
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
<<<<<<< Updated upstream:initialize/database/db.js
    loadDir = require('../../helpers/loadDirectory.js'),
    client = require('../../config/bot.js'),
    db = path.resolve(__dirname, '../../database/db.json'),
=======
    config = require('../../../config/bot.js'),
    db = path.resolve(__dirname, '../../../database/db.json'),
>>>>>>> Stashed changes:core/initialize/database/db.js
    data;


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
<<<<<<< Updated upstream:initialize/database/db.js
_.forEach(client.opt.channels, function (property, key) {
=======
_.forEach(config.irc.channels, function (property) {
>>>>>>> Stashed changes:core/initialize/database/db.js
    var propertyLower = property.toLowerCase();
    if (!data.channels[propertyLower]) data.channels[propertyLower] = {};
    if (!data.channels[propertyLower].users) data.channels[propertyLower].users = {};
    if (!data.channels[propertyLower].links) data.channels[propertyLower].links = {};
});

module.exports = data;