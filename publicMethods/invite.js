"use strict";
var client = require('../config/bot.js');


var method = function (channel, data) {
    return client.send("INVITE", data, channel);
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