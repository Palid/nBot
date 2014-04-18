"use strict";
var _ = require('lodash');

var method = function invite(options) {
    var channel = options.from,
        nick = options.to,
        data = options.message;

    if (_.isString(channel) && _.isString(nick)) {
        return {
            type: "command",
            command: "INVITE",
            to: nick,
            nick: channel
        };
    } else {
        return {
            type: "say",
            to: channel,
            message: "Invite error."
        };
    }
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