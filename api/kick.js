"use strict";
var _ = require('lodash'),
    client = require('../config/bot.js');

var method = function (channel, data, commandGiver) {

    var firstWhitespace = _.indexOf(data, ' '),
        nick = data.substring(0, firstWhitespace),
        body = data.substring(firstWhitespace + 1);

    if (nick === "chomis" || body === "chomis") {
        client.send("KICK", channel, commandGiver, "Czemu chcesz wykopać chomika? ;_;");

        return {
            type: "command",
            command: "KICK",
            to: channel,
            nick: commandGiver,
            message: "Czemu chcesz wykopać chomika? ;_;"
        };
    } else {
        return {
            type: "command",
            command: "KICK",
            to: channel,
            nick: nick,
            message: body
        };
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