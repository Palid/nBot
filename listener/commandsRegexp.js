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
                if (item.fnc) {
                    item.fnc(from, to, message);
                }
                if (item.re) {
                    var match = message.match(item.re);
                    if (match) {
                        item.method(from, to, message, match);
                    }
                }
            });
        }
    };
module.exports = method;