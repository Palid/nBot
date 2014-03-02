"use strict";
var fs = require('fs'),
    path = require('path'),
    log = require('./log.js'),
    config = path.resolve(__dirname, "../config/aliases.json"),
    hotLoad = require('./hotload.js'),
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
        '**************************************************' + '\r\n');


    parsed = hotLoad('../initialize/parseJSON.js');
    aliasesDict = hotLoad('../initialize/createAliasDict.js');
    // console.log(require.cache);

    // require.uncache('../initialize/createAliasDict.js');

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