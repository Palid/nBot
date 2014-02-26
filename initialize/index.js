'use strict';
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    log = require('../privateMethods/log.js'),
    config = path.resolve(__dirname, "../config/aliases.json");

console.log("Creating configs and folders");

/**
 * Requires order is really important here.
 * That's the main reason why things can't really be automatic.
 */


// create Folders
require('./createFolders.js');

// parse JSON
require('./parseJSON.js');

// create aliases.json config file
require('./createAliasesJSON.js');

// create aliases dict
require('./createAliasDict.js');


//reCreate aliases on file change


// TODO

// fs.watchFile(config, function (curr, prev) {

//     console.log("aliases.json got changed - reloading!");

//     log(false,
//         "fileChanges",
//         'the current mtime is: ' + curr.mtime + '\r\n' +
//         'the previous mtime was: ' + prev.mtime + '\r\n' +
//         '**************************************************');

//     //clear modules cache
//     delete require.cache[require.resolve('./parseJSON.js')];
//     delete require.cache[require.resolve('./createAliasDict.js')];

//     // parse JSON
//     require('./parseJSON.js');

//     // create aliases dict
//     require('./createAliasDict.js');

// });