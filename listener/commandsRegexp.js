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
            if (property.re.test(message)) {
                property.method(from, to, message);
            }
        });
    };

module.exports = method;