"use strict";
/**
 * Requires order is really important here.
 * That's the main reason why things can't really be automatic.
 */

console.info("Creating Aliases JSON");
require('./createAliasesJSON.js');

console.info("Initializing database");
require('./db.js');

console.info("Initializing listener events");
require('../listener/');