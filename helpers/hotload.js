"use strict";
var path = require('path');

function method(dirname, dir) {
    var modulePath = path.resolve(dirname, dir);

    console.log("Reloading: " + modulePath);

    delete require.cache[modulePath];
    return require(modulePath);
}


module.exports = method;