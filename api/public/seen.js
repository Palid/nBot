"use strict";
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var rek = require('rekuire');
var bot = rek('/bot.js');
var events = bot.events;

var botNick = bot.getConfig('nick').toLowerCase();

var method = function seen(options) {
    var nick = options.message.trim().toLowerCase();

    if (nick === botNick) {
        events.emit('apiSay',
            options.to,
            "I'm right here. :)"
        );
    } else {
        User.findOne({
            $and: [{
                $or: [{
                    nick: nick
                }, {
                    'aliases.alias': nick
                }]
            }, {
                'seen.channel': options.to
            }]
        }, function (err, doc) {
            if (err) console.log(err);
            if (doc) {
                var max = _.max(doc.seen, function (channels) {
                    return channels.date;
                });
                // var min = _.min(doc.seen, function (channels) {
                //     return channels.date;
                // });
                // var currentChannel = _.find(doc.seen, function (channels) {
                //     return channels.channel === options.to;
                // });
                var response;
                if (max.message) {
                    response = [
                        doc.nick,
                        "was last seen",
                        max.date,
                        "on channel",
                        max.channel,
                        "while saying",
                        max.message
                    ].join(" ");
                } else {
                    response = [
                        doc.nick,
                        "was last seen",
                        max.date,
                        "while joining channel",
                        max.channel
                    ].join(" ");
                }
                events.emit('apiSay', options.to, response);
            } else {
                events.emit('apiSay',
                    options.to,
                    "I didn't see this user speak even once."
                );
            }
        });
    }

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