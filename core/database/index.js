"use strict";
var loadDir = require('../../helpers/loadDirectory.js');

module.exports = loadDir('./schema', {
    currentDir: __dirname,
    type: '.js',
    recursive: false,
    event: 'schemaLoaded'
});;