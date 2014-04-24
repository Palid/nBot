"use strict";
var _ = require('lodash'),
    makeDirs = require('../../helpers/makeDirs.js'),
    getters = require('./getters.js'),
    setters = require('./setters.js');

makeDirs({
    database: 'database',
    users: 'database/users',
    urls: 'database/urls',
    channels: 'database/channels'
});

module.exports = {
    setters: setters,
    getters: getters
};