"use strict";
var _ = require('lodash'),
    events = require('../../core/events.js'),
    client = require('../../config/bot.js').irc;

var method = function kick(options) {
    var splitted = _.pull(options.message.split(" "), "");
    var nick = splitted[0];
    var body = splitted.length >= 2 ? splitted.slice(1, splitted.length).join(" ") : "";

    if (nick === client.nick) {
        events.emit('apiCommand', {
            type: "command",
            command: "KICK",
            to: options.to,
            nick: options.from,
            message: "Why are you trying to kick " + client.nick + "? ;_;"
        });
    } else {
        events.emit('apiCommand', {
            type: "command",
            command: "KICK",
            to: options.to,
            nick: nick,
            message: body
        });
    }
};

var defaults = {
    description: {
        pl: ",kick [użytkownik] [powód] - Wykopuje [użytkownika] z kanału z [powodem].",
        en: ",kick [user] [reason] - Kicks [user] with [reason]"
    },
    aliases: [
        "k"
    ],
    level: 4
};


module.exports = {
    method: method,
    defaults: defaults
};