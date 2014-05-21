"use strict";
var _ = require('lodash'),
    events = require('../../core/events.js'),
    config = require('../../config/bot.js');

var len = config.irc.channelPrefixes.length;

var method = function message(options) {

    _.forEach(config.irc.channelPrefixes, function (property, index) {
        if (options.message.substring(0, 1) === property) {
            events.emit('apiSay', options.to, "It's not a user.");

        } else if (index === len - 1) {
            var firstWhitespace = _.indexOf(options.message, ' '),
                nick = options.message.substring(0, firstWhitespace),
                body = options.message.substring(firstWhitespace + 1);
            events.emit('apiSay', nick, body);
        }
    });

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