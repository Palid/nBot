"use strict";
var _ = require('lodash'),
    REGEXES = {
        command: new RegExp(/,/),
        urlTitle: new RegExp(/http(s?):\/\/(\S+)|(www\.\S+)/),
    },
    METHODS = {
        command: require('./checkCommand.js'),
        urlTitle: require('./urlScrape.js'),
    },
    method = function regexStarter(from, to, message) {
        _.forEach(REGEXES, function (property, key) {
            if (property.test(message)) {
                METHODS[key](from, to, message);
            }
        });
    };

module.exports = method;