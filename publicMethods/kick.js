"use strict";
var _ = require('lodash'),
    irc = require('irc'),
    client = require('../config/bot.js');

var method = function (channel, data, commandGiver) {

    var firstWhitespace = _.indexOf(data, ' '),
        nick = data.substring(0, firstWhitespace),
        body = data.substring(firstWhitespace + 1);

    if (nick === "chomis" || body === "chomis") {

        return client.send("KICK", channel, commandGiver, "Czemu chcesz wykopać chomika? ;_;");
    } else {
        return client.send("KICK", channel, nick, body);
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