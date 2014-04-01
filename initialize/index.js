"use strict";
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    log = require('../helpers/log.js'),
    makeDirs = require('./createFolders.js'),
    config = path.resolve(__dirname, "../config/aliases.json");




/**
 * Requires order is really important here.
 * That's the main reason why things can't really be automatic.
 */

console.log("Creating configs and folders");
makeDirs('logs');

require('./parseJSON.js');

try {
    require('./createAliasesJSON.js');
} catch (err) {
    console.log(err);
}


require('./createAliasDict.js');

// var pars = parsed(config),
//     jsonFile = createJSON(pars),
//     dict = aliasesDict(pars);