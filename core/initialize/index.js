"use strict";
var makeDirs = require('../../helpers/makeDirs.js');

/**
 * Requires order is really important here.
 * That's the main reason why things can't really be automatic.
 */

// Create directories
makeDirs({
    logs: 'logs',
    users: 'logs/users',
    urls: 'logs/urls',
    channels: 'logs/channels',
    database: 'database'
});

console.info("Initializing database");
require('./database/backup.js');

console.info("Creating Aliases JSON");
require('./createAliasesJSON.js');

console.info("Initializing listener events");
require('../../listener/');