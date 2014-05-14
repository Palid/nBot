"use strict";
var fs = require('fs'),
    path = require('path'),
    dir = path.resolve(__dirname, '../../database/db.json'),
    db = require('./db.js');

// Save the base instantly
fs.writeFile(dir, JSON.stringify(db, null, 4), function (err) {
    if (err) console.log(err);
});


// Write data to file every minute.
setInterval(function () {
    fs.writeFile(dir, JSON.stringify(db, null, 4), function (err) {
        if (err) console.log(err);
    });
}, 60000);