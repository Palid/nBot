"use strict";
var _ = require('lodash'),
    rek = require('rekuire'),
    loadDir = rek('helpers/loadDirectory.js'),
    // Regular methods which will fire every received message
    METHODS = loadDir('./methods', {
        currentDir: __dirname,
        type: '.js',
        recursive: false,
        returnDict: true
    }),
    method = function regexStarter(from, to, message) {
        if (message) {
            _.forEach(METHODS, function (item) {
                var match;
                if (item.fnc) {
                    item.fnc(from, to, message);
                } else if (item.messageRe) {
                    match = message.match(item.messageRe);
                    if (match) {
                        item.method(from, to, message, match);
                    }
                } else if (item.channelRe) {
                    match = to.match(item.channelRe);
                    if (match) {
                        item.method(from, to, message, match);
                    }
                } else {
                    item.method(from, to, message);
                }
            });
        }
    };
module.exports = method;
