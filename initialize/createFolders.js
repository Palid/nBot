"use strict";
var fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    rootPath = "../";


function method(dirName) {
    if (fs.existsSync(path.resolve(__dirname, rootPath + "/" + dirName))) {
        console.log("Directory " + dirName + " exists, not creating");
    } else {
        console.log("Creating directory " + dirName);
        fs.mkdirSync(path.resolve(__dirname, rootPath + "/" + dirName));
    }
}

module.exports = method;