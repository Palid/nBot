"use strict";
var _ = require('lodash');

var method = function message(options) {
    var channel = options.to,
        data = options.message;

    if (data.substring(0, 1) !== '#') {

        var firstWhitespace = _.indexOf(data, ' '),
            nick = data.substring(0, firstWhitespace),
            body = data.substring(firstWhitespace + 1);

        return {
            type: "say",
            to: nick,
            message: body
        };

    }
    return {
        type: "say",
        to: channel,
        message: "Couldn't send text message."
    };
};

var defaults = {
    description: {
        pl: ",message [użytkownik] [wiadomość] - Wysyła [wiadomość] do [użytkownika].",
        en: ",message [user] [message] - Sends [message] to [user]."
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