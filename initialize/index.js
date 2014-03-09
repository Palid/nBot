"use strict";
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    log = require('../privateMethods/log.js'),
    makeDirs = require('./createFolders.js'),
    config = path.resolve(__dirname, "../config/aliases.json");




/**
 * Requires order is really important here.
 * That's the main reason why things can't really be automatic.
 */

console.log("Creating configs and folders");
makeDirs('logs');