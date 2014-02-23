/*jslint node: true */
"use strict";
var irc = require('irc'),
    client = require('../config/bot.js');

var method = function (channel, topic) {
    client.say(channel + ' topic changed to ' + topic);
    return client.send("TOPIC", channel, topic);
};

module.exports = method;