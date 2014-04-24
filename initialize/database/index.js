"use strict";
var _ = require('lodash'),
    makeDirs = require('../../helpers/makeDirs.js');

makeDirs({
    database: 'database',
    users: 'database/users',
    urls: 'database/urls',
    channels: 'database/channels'
});

module.exports = {
    set: require('./setters.js'),
    get: require('./getters.js')
};