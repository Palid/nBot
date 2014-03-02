"use strict";
var path = require('path');

function method(dir) {
    delete require.cache[path.resolve(__dirname, dir)];

    return require(dir);
}

module.exports = method;