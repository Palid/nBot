"use strict";
var loadDir = require('../helpers/loadDirectory.js');

module.exports = loadDir(__dirname, {
    currentDir: __dirname,
    type: '.js',
    maxDepth: 0,
    event: 'apiLoaded'
});