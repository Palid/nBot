"use strict";
var _ = require('lodash');
var events = require('../../core/events.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');

/**
 * memo Saves private message for a user.
 * @param  {Object} options Options object always returned on API call
 * -       {String} to      Channel or user to which the API should respond
 * -       {String} from    User who made the API call
 * -       {String} message Parsed message without the command
 * @return {Emitter}        Returns an event when function's finished for parsing
 */
var method = function memo(options) {

    var splitted = _.pull(options.message.split(" "), "");
    var nick = splitted[0];
    var body = splitted.length >= 2 ? splitted.slice(1, splitted.length).join(" ") : "";

    User.findOne({
        $or: [{
            nick: nick
        }, {
            'aliases.alias': nick
        }]
    }, function (err, doc) {
        if (err) console.log(err);
        if (doc && body !== '') {
            User.update({
                $or: [{
                    nick: nick
                }, {
                    'aliases.alias': nick
                }]
            }, {
                $addToSet: {
                    memo: {
                        from: options.from,
                        date: Date.now(),
                        message: body
                    }
                },
            }, function (err) {
                if (err) console.log(err);
                events.emit('apiSay',
                    options.to,
                    "Memo added for " + nick
                );
            });
        } else if (body === '') {
            events.emit('apiSay',
                options.to,
                "Memo can't be blank."
            );
        } else {
            events.emit('apiSay',
                options.to,
                "I don't recognize this person."
            );
        }
    });
};

//
var defaults = {
    description: {
        pl: ",memo [nick] [wiadomość] - Zostawia [wiadomość] dla [nick]",
        en: ",memo [nick] [message] - Leaves [message] for [nick]"
    },
    aliases: []
};


module.exports = {
    method: method,
    defaults: defaults
};