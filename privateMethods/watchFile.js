"use strict";
var fs = require('fs'),
    path = require('path'),
    config = path.resolve(__dirname, "../config/aliases.json"),
    parsed = require('../initialize/parseJSON.js'),
    createJSON = require('../initialize/createAliasesJSON.js'),
    aliasesDict = require('../initialize/createAliasDict.js');

var pars = parsed(config),
    jsonFile = createJSON(pars),
    dict = aliasesDict(pars);


module.exports = {
    aliases: dict,
    parsed: parsed
};