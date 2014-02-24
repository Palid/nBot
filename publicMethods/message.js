/*jslint node: true */
"use strict";
var _ = require('lodash'),
    irc = require('irc'),
    client = require('../config/bot.js');


var method = function (channel, data) {

    if (data.substring(0, 1) !== '#') {

        var firstWhitespace = _.indexOf(data, ' '),
            nick = data.substring(0, firstWhitespace),
            body = data.substring(firstWhitespace + 1);

        return client.say(nick, body);
    }
    return client.say(channel, "Couldn't send text message.");
};

var defaults = {
    description: {
        pl: ",message [użytkownik] [wiadomość] - Wysyła [wiadomość] do [użytkownika].",
        eng: ",message [user] [message] - Sends [message] to [user]."
    },
    aliases: [
        "msg",
        "send"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};