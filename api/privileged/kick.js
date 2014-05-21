"use strict";
var _ = require('lodash'),
    events = require('../../core/events.js'),
    client = require('../../config/bot.js');

var method = function kick(options) {
    var channel = options.to,
        commandGiver = options.from,
        data = options.message;

    var firstWhitespace = _.indexOf(data, ' '),
        nick = firstWhitespace > 0 ?
            data.substring(0, firstWhitespace).toLowerCase() :
            data.toLowerCase(),
        body = firstWhitespace > 0 ? data.substring(firstWhitespace + 1) : "";

    if (nick === client.nick || body === client.nick) {
        events.emit('apiCommand', {
            type: "command",
            command: "KICK",
            to: channel,
            nick: commandGiver,
            message: "Why are you trying to kick " + client.nick + "? ;_;"
        });
    } else {
        events.emit('apiCommand', {
            type: "command",
            command: "KICK",
            to: channel,
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
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};