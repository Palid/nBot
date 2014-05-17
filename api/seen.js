"use strict";
var _ = require('lodash'),
    db = require('../core/database/'),
    events = require('../helpers/events.js'),
    config = require('../config/bot.js');

var botNick = config.irc.nick.toLowerCase();

var method = function seen(options) {
    var nick = options.message.trim().toLowerCase();

    if (nick === botNick) {
        events.emit('apiSay',
            options.to,
            "I'm right here. :)"
        );
    } else {
        db.User.findOne({
            $and: [{
                nick: nick
            }, {
                'seen.channel': options.to
            }]
        }, {
            _id: 0
        }, function (err, resp) {
            if (err) console.log(err);
            if (resp) {
                var max = _.max(resp.seen, function (channels) {
                    return channels.date;
                });
                // var min = _.min(resp.seen, function (channels) {
                //     return channels.date;
                // });
                // var currentChannel = _.find(resp.seen, function (channels) {
                //     return channels.channel === options.to;
                // });
                var response = [
                    nick,
                    "was last seen",
                    max.date,
                    "on channel",
                    max.channel,
                    "while saying",
                    max.message
                ].join(" ");
                events.emit('apiSay', options.to, response);
            } else {
                events.emit('apiSay',
                    options.to,
                    "I didn't see this user speak even once."
                );
            }
        });
    }

    return {
        type: "async"
    };

};

var defaults = {
    description: {
        pl: ",seen [nick] - Bot podaje datę ostatniej wiadomości [nick].",
        en: ",seen [nick] - Bot says [nick]'s last message date."
    },
    aliases: []
};


module.exports = {
    method: method,
    defaults: defaults
};