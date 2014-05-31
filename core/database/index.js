"use strict";
var loadDir = require('../../helpers/loadDirectory.js');

module.exports = loadDir('./models', {
    currentDir: __dirname,
    type: '.js',
    recursive: false,
    event: 'modelsLoaded',
    returnDict: true
});