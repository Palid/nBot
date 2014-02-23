/*jslint node: true */
"use strict";
var irc = require('irc'),
    client = require('../config/bot.js');

var method = function (channel, topic) {
    client.say(channel + ' topic changed to ' + topic);
    return client.send("TOPIC", channel, topic);
};

var defaults = {
    description: {
        pl: ",topic [string] - Zmienia temat kanału na [string].",
        eng: ",topic [string] - Changes channel topic to [string]."
    },
    aliases: [
        "t"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};