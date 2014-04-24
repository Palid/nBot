"use strict";
var _ = require('lodash'),
    db = require('./db.js');

function set(key, property) {
    db[key] = property;
}

function safeSet(key, property) {
    if (_.isUndefined(db[key])) db[key] = property;
}

function setSeen(from, to) {
    if (_.isUndefined(db.channels[to].users[from])) {
        db[to].users[from] = {};
        if (_.isUndefined(db.channels[to].users[from].aliases)) db[to].users[from].aliases = [];
        if (_.isUndefined(db.channels[to].users[from])) db[to].users[from] = {};
        if (_.isUndefined(db.channels[to].users[from].memo)) db[to].users[from].memo = [];
    }
    db.channels[to].users[from].seen = new Date().toString();
}

module.exports = {
    set: set,
    safeSet: safeSet,
    setSeen: setSeen
};