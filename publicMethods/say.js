"use strict";
var client = require('../config/bot.js');


var method = function (channel, data) {
    return client.say(channel, data);
};

var defaults = {
    description: {
        pl: ",say [string] - Bot wypowiada [string].",
        en: ",say [string] - Bot says [string]."
    },
    aliases: [
        "s"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};