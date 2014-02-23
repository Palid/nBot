/*jslint node: true */
"use strict";
var irc = require('irc'),
    client = require('../config/bot.js');


var method = function (channel, data) {
    return client.send("INVITE", data, channel);
};

var defaults = {
    description: {
        pl: ",invite [użytkownik] [kanał] - Zaprasza [użytkownika] na [kanał].",
        eng: ",invite [user] [channel] - Invites [user] on [channel]."
    },
    aliases: [
        "inv"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};