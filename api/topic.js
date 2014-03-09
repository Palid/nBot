"use strict";
var client = require('../config/bot.js');

var method = function (channel, topic) {
    client.say(channel + ' topic changed to ' + topic);
    return {
        type: "command",
        to: channel,
        message: topic
    };
};

var defaults = {
    description: {
        pl: ",topic [string] - Zmienia temat kanału na [string].",
        en: ",topic [string] - Changes channel topic to [string]."
    },
    aliases: [
        "t"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};