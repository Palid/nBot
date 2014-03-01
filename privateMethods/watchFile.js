"use strict";
var fs = require('fs'),
    path = require('path'),
    log = require('./log.js'),
    config = path.resolve(__dirname, "../config/aliases.json"),
    parsed = require('../initialize/parseJSON.js'),
    createJSON = require('../initialize/createAliasesJSON.js'),
    aliasesDict = require('../initialize/createAliasDict.js');


var pars = parsed(config),
    jsonFile = createJSON(pars),
    dict = aliasesDict(pars);

// console.log(pars);
// console.log(dict);

fs.watchFile(config, function (curr, prev) {

    console.log("aliases.json got changed - reloading!");

    log(false,
        "fileChanges",
        'the current mtime is: ' + curr.mtime + '\r\n' +
        'the previous mtime was: ' + prev.mtime + '\r\n' +
        '**************************************************');

    pars = parsed(config);
    dict = aliasesDict(pars);

    module.exports = {
        aliases: dict,
        parsed: parsed
    };
    // console.log(dict);


    // // create Folders
    // require('./createFolders.js');

    // // parse JSON
    // parsed();
    // require('./parseJSON.js');

    // // create aliases.json config file
    // require('./createAliasesJSON.js');

    // // create aliases dict
    // require('./createAliasDict.js');

    //reCreate aliases on file change

});

module.exports = {
    aliases: dict,
    parsed: parsed
};

/**
 * Removes a module from the cache
 */
require.uncache = function (moduleName) {
    // Run over the cache looking for the files
    // loaded by the specified module name
    require.searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });
};

/**
 * Runs over the cache to search for all the cached
 * files
 */
require.searchCache = function (moduleName, callback) {
    // Resolve the module identified by the specified name
    var mod = require.resolve(moduleName);

    // Check if the module has been resolved and found within
    // the cache
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function run(mod) {
            // Go over each of the module's children and
            // run over it
            mod.children.forEach(function (child) {
                run(child);
            });

            // Call the specified callback providing the
            // found module
            callback(mod);
        })(mod);
    }
};