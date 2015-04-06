"use strict";
var fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    rootPath = "../";


function checkDirs(dirName) {
    if (fs.existsSync(path.resolve(__dirname, rootPath + "/" + dirName))) {
        console.log("Directory " + dirName + " exists, not creating");
    } else {
        console.log("Creating directory " + dirName);
        fs.mkdirSync(path.resolve(__dirname, rootPath + "/" + dirName));
    }
}

var method = function makeDirs(directories) {
    if (!_.isString(directories)) {
        _.forEach(directories, function (property) {
            checkDirs(property);
        });
    } else {
        checkDirs(directories);
    }
};

module.exports = method;