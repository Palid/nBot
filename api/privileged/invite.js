"use strict";
var rek = require('rekuire');
var events = rek('/bot.js').events;


var method = function invite(options) {

    events.emit('apiCommand', {
        type: "command",
        command: "INVITE",
        to: options.to,
        nick: options.message.trim().toLowerCase()
    });
};

var defaults = {
    description: {
        pl: ",invite [użytkownik] [kanał] - Zaprasza [użytkownika] na [kanał].",
        en: ",invite [user] [channel] - Invites [user] on [channel]."
    },
    aliases: [
        "inv"
    ],
    level: 1
};


module.exports = {
    method: method,
    defaults: defaults
};