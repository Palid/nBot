/*jslint node: true */
"use strict";
var irc = require('irc'),
    client = require('../config/bot.js');


var method = function (channel, data) {
    return client.say(channel, data.toUpperCase());
};

module.exports = method;