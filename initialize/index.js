"use strict";
/**
 * Requires order is really important here.
 * That's the main reason why things can't really be automatic.
 */

console.info("Initializing database");
require('./database/backup.js');

console.info("Creating Aliases JSON");
require('./createAliasesJSON.js');

console.info("Initializing listener events");
require('../listener/');