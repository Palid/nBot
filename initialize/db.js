"use strict";
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    db = path.resolve(__dirname, '../database/db.json'),
    data;

try {
    data = JSON.parse(fs.readFileSync(db, 'utf8'));
} catch (err) {
    console.log(err);
    data = {};
}

console.log(data);

// Write data to file every minute.
setInterval(function () {
    fs.writeFile(db, JSON.stringify(data, null, 4), function (err) {
        console.log(err);
    });
}, 60000);

module.exports = data;