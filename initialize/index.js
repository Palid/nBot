"use strict";
var makeDirs = require('../helpers/makeDirs.js');
/**
 * Requires order is really important here.
 * That's the main reason why things can't really be automatic.
 */

// Create log directories
makeDirs({
    logs: 'logs',
    users: 'logs/users',
    urls: 'logs/urls',
    channels: 'logs/channels'
});

// Create database directories if DB type is "JSON"
makeDirs({
    database: 'database',
    users: 'database/users',
    urls: 'database/urls',
    channels: 'database/channels'
});

console.info("Initializing database");
require('./database/backup.js');

console.info("Creating Aliases JSON");
require('./createAliasesJSON.js');

console.info("Initializing listener events");
require('../listener/');