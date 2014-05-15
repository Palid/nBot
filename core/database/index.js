"use strict";
var loadDir = require('../../helpers/loadDirectory.js');

module.exports = loadDir('./schema', {
    currentDir: __dirname,
    type: '.js',
    maxDepth: 0,
    event: 'schemaLoaded'
});