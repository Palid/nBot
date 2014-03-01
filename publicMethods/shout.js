"use strict";
var client = require('../config/bot.js');


var method = function (channel, data) {
    return client.say(channel, data.toUpperCase());
};

var defaults = {
    description: {
        pl: ",shout [string] - Bot wykrzykuje [string].",
        en: ",shout [string] - Bot shouts [string]."
    },
    aliases: []
};


module.exports = {
    method: method,
    defaults: defaults
};