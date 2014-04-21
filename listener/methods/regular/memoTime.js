"use strict";
var path = require('path'),
    _ = require('lodash'),
    rootDir = path.dirname(require.main.filename),
    db = require(rootDir + '/initialize/db.js');

var method = function usersLog(from, to, message) {

    if (_.isUndefined(db[to])) {
        db[to] = {};
        if (_.isUndefined(db[to].users)) db[to].users = {};
        if (_.isUndefined(db[to].links)) db[to].links = {};
    }

    if (_.isUndefined(db[to].users[from])) {
        db[to].users[from] = {};
        if (_.isUndefined(db[to].users[from].aliases)) db[to].users[from].aliases = [];
        if (_.isUndefined(db[to].users[from])) db[to].users[from] = {};
        if (_.isUndefined(db[to].users[from].memo)) db[to].users[from].memo = [];
    }
    db[to].users[from].seen = new Date().toString();

};


module.exports = method;