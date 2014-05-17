"use strict";
var _ = require('lodash'),
    jsesc = require('jsesc'),
    config = require('../config/bot.js'),
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
            re: new RegExp("^[" + jsesc(config.options.commandCharacter) +
                "]{" + config.options.commandCharacter.length + "}"),
            method: require('./methods/context/checkCommand.js')
        },
        urlTitle: {
            re: new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})*\/?/),
            method: require('./methods/context/urlScrape.js')
        },
    },
    method = function regexStarter(from, to, message) {
        var priv = true;
        _.forEach(config.irc.channelPrefixes, function (property) {
            console.log(to, property);
            console.log(_.indexOf(to, property));
            if (_.indexOf(to, property) !== -1) {
                priv = false;
                _.forEach(REGULAR, function (property) {
                    property.method(from, to, message);
                });
                _.forEach(CONTEXTDEPENDANT, function (property) {
                    var match = message.match(property.re);
                    if (match) {
                        property.method(from, to, message, match);
                    }
                });
            }
        });
        if (priv) {
            var match = message.match(CONTEXTDEPENDANT.command.re);
            if (match) CONTEXTDEPENDANT.command.method(from, to, message, match);
        }
    };
module.exports = method;