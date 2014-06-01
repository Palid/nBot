"use strict";
var _ = require('lodash');
var events = require('../../core/events.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var COMMANDS = {
    list: function list(channel) {
        events.emit("apiSay", channel,
            "Command not found. List of commands: " +
            _.keys(COMMANDS).join(" ")
        );
    },
    level: function getLevel(channel, from, nick) {
        User.findOne({
            nick: nick
        }, function (err, doc) {
            if (err) console.log(err);
            if (doc) {
                events.emit("apiSay", channel,
                    nick + "'s permission level is: " +
                    doc.permissions.level
                );
            } else {
                events.emit("apiSay", channel, "User " + nick + " not found.");
            }
        });
    },
    set: function setLevel(channel, from, nick, level) {
        var newLevel = parseInt(level, 10);
        if (newLevel > 5) newLevel = 5;
        if (!_.isNaN(newLevel)) {
            User.findOne({
                nick: nick
            }, function (err, doc) {
                var self = doc;
                if (err) console.log(err);
                User.findOne({
                    nick: from
                }, function (err, doc) {
                    if (err) console.log(err);
                    if (doc.permissions.level < self.permissions.level) {
                        events.emit("apiSay", channel,
                            "You can't change permissions for user of higher rank."
                        );
                    } else if (newLevel > doc.permissions.level) {
                        events.emit("apiSay", channel,
                            "You can't change permissiont to higher rank than your own."
                        );
                    } else {
                        self.permissions.level = newLevel;
                        self.save();
                        events.emit("apiSay", channel,
                            "Permission level updated for " + nick + "." +
                            " Current level: " + newLevel
                        );
                    }
                });
            });
        }
    },
    alias: function aliases(channel) {

    }
};

/**
 * [method Your New API Function]
 * @param  {Object} options Options object always returned on API call
 * -       {String} to      Channel or user to which the API should respond
 * -       {String} from    User who made the API call
 * -       {String} message Parsed message without the command
 * @return {Emitter}        Returns an event when function's finished for parsing
 */
var method = function user(options) {
    var splitted = _.pull(options.message.split(" "), "");
    var len = splitted.length;
    var nick = splitted[0].toLowerCase();
    var command = len >= 2 ? splitted[1] : "";
    var body = len >= 3 ? splitted.slice(2, len).join(" ") : "";

    if (COMMANDS[command]) COMMANDS[command](options.to, options.from, nick, body);
    else COMMANDS.list(options.to);
};

var defaults = {
    description: {
        pl: ",user [nick] [komenda] - Zwraca [komenda] dla [nick]",
        en: ",user [nick] [command] - Returns [command] for [nick]"
    },
    aliases: [],
    level: 0
};


module.exports = {
    method: method,
    defaults: defaults
};