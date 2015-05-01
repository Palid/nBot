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


    // Create directories
    makeDirs({
        logs: 'logs',
        users: 'logs/users',
        urls: 'logs/urls',
        channels: 'logs/channels'
    });

    console.info("Initializing listener events");
    require('../listener/index.js');
}
module.exports = init;
