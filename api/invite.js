"use strict";
var client = require('../config/bot.js');


var method = function (channel, nick) {
    return {
        type: "command",
        command: "INVITE",
        to: nick,
        body: channel
    };
};

var defaults = {
    description: {
        pl: ",invite [użytkownik] [kanał] - Zaprasza [użytkownika] na [kanał].",
        en: ",invite [user] [channel] - Invites [user] on [channel]."
    },
    aliases: [
        "inv"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};