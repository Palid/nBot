"use strict";
var path = require('path'),
    _ = require('lodash'),
    rootDir = path.dirname(require.main.filename),
    db = require(rootDir + '/initialize/database/index.js');

var method = function usersLog(from, to, message) {
    db.setters.setSeen(from, to);

};



module.exports = method;