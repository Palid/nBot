"use strict";
var _ = require('lodash'),
    METHODS = {
        command: {
            re: new RegExp(/^\,{1}/),
            method: require('./checkCommand.js')
        },
        urlTitle: {
            re: new RegExp(/http(s?):\/\/(\S+)|(www\.\S+)/),
            method: require('./urlScrape.js')
        },
    },
    method = function regexStarter(from, to, message) {
        _.forEach(METHODS, function (property, key) {
            var match = message.match(property.re);
            if (match) {
                property.method(from, to, message, match);
            }
        });
    };

module.exports = method;