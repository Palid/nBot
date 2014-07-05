"use strict";
var rek = require('rekuire');
var loadDir = rek('helpers/loadDirectory.js');
var makeDirs = rek('helpers/makeDirs.js');

/**
 * Requires order is really important here.
 * That's the main reason why things can't really be automatic.
 */

// Initialize loading
function init() {

    // Load mongoose models
    loadDir('../models', {
        currentDir: __dirname,
        type: '.js',
        recursive: false,
        event: 'modelsLoaded',
        returnDict: false
    });

    // Create directories
    makeDirs({
        logs: 'logs',
        users: 'logs/users',
        urls: 'logs/urls',
        channels: 'logs/channels',
        database: 'database'
    });

    console.info("Setting up database");
    require('./initialize/dbSetup.js');

    console.info("Initializing database");
    require('./initialize/index.js');

    console.info("Setting up commands database");
    require('./initialize/cmdList.js');

    console.info("Initializing listener events");
    require('../listener/index.js');
}
module.exports = init;