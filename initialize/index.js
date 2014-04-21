"use strict";
var makeDirs = require('./createFolders.js');

/**
 * Requires order is really important here.
 * That's the main reason why things can't really be automatic.
 */

console.log("Creating configs and folders");
makeDirs('database');
makeDirs('database/users');
makeDirs('database/urls');
makeDirs('logs');
makeDirs('logs/users');

console.log("Creating Aliases JSON");
require('./createAliasesJSON.js');

require('../listener/');