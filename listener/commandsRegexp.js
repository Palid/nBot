"use strict";
var _ = require('lodash'),
    jsesc = require('jsesc'),
    commandChar = require('../config/bot.js').options.commandCharacter,
    // Regular methods which will fire every received message
    REGULAR = {
        lastSeen: {
            method: require('./methods/regular/lastSeen.js')
        }
    },
    // Context dependant message which will fire only when message passed
    // through the regex tests
    CONTEXTDEPENDANT = {
        command: {
            re: new RegExp("^[" + jsesc(commandChar) +
                "]{" + commandChar.length + "}"),
            method: require('./methods/context/checkCommand.js')
        },
        urlTitle: {
            // re: new RegExp(/http(s?):\/\/(\S+)|(www\.\S+)/),
            // re: new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/),
            re: new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})*\/?/),
            method: require('./methods/context/urlScrape.js')
        },
    },
    method = function regexStarter(from, to, message) {
        if (_.indexOf(to, '#') !== -1) {
            _.forEach(REGULAR, function (property) {
                property.method(from, to, message);
            });
            _.forEach(CONTEXTDEPENDANT, function (property) {
                var match = message.match(property.re);
                if (match) {
                    property.method(from, to, message, match);
                }
            });
        } else {
            var match = message.match(CONTEXTDEPENDANT.command.re);
            if (match) CONTEXTDEPENDANT.command.method(from, to, message, match);
        }
    };
module.exports = method;