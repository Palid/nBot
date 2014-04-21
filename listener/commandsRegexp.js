"use strict";
var _ = require('lodash'),
    REGULAR = {
        logMemo: {
            method: require('./methods/regular/memoTime.js')
        }
    },
    CONTEXTDEPENDANT = {
        command: {
            re: new RegExp(/^\,{1}/),
            method: require('./methods/context/checkCommand.js')
        },
        urlTitle: {
            re: new RegExp(/http(s?):\/\/(\S+)|(www\.\S+)/),
            method: require('./methods/context/urlScrape.js')
        },
    },
    method = function regexStarter(from, to, message) {
        _.forEach(REGULAR, function (property, key) {
            property.method(from, to, message);
        });
        _.forEach(CONTEXTDEPENDANT, function (property, key) {
            var match = message.match(property.re);
            if (match) {
                property.method(from, to, message, match);
            }
        });
    };

module.exports = method;