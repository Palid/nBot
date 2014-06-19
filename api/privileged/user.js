"use strict";
var _ = require('lodash');
var events = require('../../core/events.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');


var PRIVATE = {
    ban: {
        setBanStatus: function setBanStatus(doc, to, status) {
            User.update({
                _id: doc._id
            }, {
                'permissions.isBanned': status
            }, function (err) {
                if (err) console.log(err);
                events.emit('apiSay', to,
                    "Ban status for user " + doc.nick +
                    " changed to: " + status);
            });
        },
        status: function getBanStatus(doc, to) {
            events.emit('apiSay', to,
                doc.permissions.isBanned ?
                "This user is banned." :
                "This user isn't banned."
            );
        },
        "false": function (doc, to) {
            return PRIVATE.ban.setBanStatus(doc, to, false);
        },
        "true": function (doc, to) {
            return PRIVATE.ban.setBanStatus(doc, to, true);
        }
    }
};


var COMMANDS = {
    list: {
        level: 0,
        method: function list(options) {
            events.emit("apiSay", options.to,
                "List of user commands: " +
                _.keys(COMMANDS).join(" ")
            );
        }
    },
    level: {
        level: 0,
        method: function getLevel(options) {
            User.findByOptions(options, function (err, doc) {
                if (err) console.log(err);
                if (doc) {
                    events.emit("apiSay", options.to,
                        "[" + options.nick + "]" + doc.nick +
                        "'s permission level is: " +
                        doc.permissions.level
                    );
                } else {
                    events.emit("apiSay", options.to,
                        "User " + options.nick + " not found."
                    );
                }
            });
        }
    },
    set: {
        level: 3,
        method: function setLevel(options) {
            var newLevel = parseInt(options.body.trim().split(' ')[0], 10);
            console.log(newLevel);
            if (newLevel > 5) newLevel = 5;
            if (!_.isNaN(newLevel)) {
                User.findOne({
                    nick: options.nick
                }, function (err, doc) {
                    var self = doc;
                    if (err) console.log(err);
                    if (options.doc.permissions.level < self.permissions.level) {
                        events.emit("apiSay", options.to,
                            "You can't change permissions for user of higher rank."
                        );
                    } else if (newLevel > options.doc.permissions.level) {
                        events.emit("apiSay", options.to,
                            "You can't change permission to higher rank than your own."
                        );
                    } else {
                        self.permissions.level = newLevel;
                        self.save();
                        events.emit("apiSay", options.to,
                            "Permission level updated for " + options.nick + "." +
                            " Current level: " + newLevel
                        );
                    }
                });
            }
        }
    },
    aliasAdd: {
        level: 3,
        method: function aliasAdd(options) {
            User.findByOptions(options, function (err, doc) {
                if (err) console.log(err);
                if (doc) {
                    var aliasFound = _.find(doc.aliases, function (item) {
                        return item.alias === options.alias;
                    });
                    if (aliasFound) {
                        events.emit('apiSay', options.to,
                            'User ' + options.nick +
                            ' already had alias ' + options.alias
                        );
                    } else {
                        User.update({
                            nick: doc.nick
                        }, {
                            $addToSet: {
                                aliases: {
                                    alias: options.alias,
                                    addedBy: options.from,
                                    date: Date.now()
                                }
                            }
                        }, function (err) {
                            if (err) console.log(err);
                            else events.emit('apiSay', options.to,
                                "Alias " + options.alias + " added for " +
                                options.nick + "."
                            );
                        });
                    }
                }
            });
        }
    },
    aliasDelete: {
        level: 3,
        method: function aliasDelete(options) {
            User.findByOptions(options, function (err, doc) {
                if (err) console.log(err);
                if (doc) {
                    User.update({
                        _id: doc._id
                    }, {
                        $pull: {
                            aliases: {
                                alias: options.nick || options.alias
                            }
                        }
                    }, function (err) {
                        if (err) console.log(err);
                        else events.emit('apiSay', options.to,
                            "Alias " + options.alias + " removed for " +
                            options.nick + "."
                        );
                    });
                } else {
                    events.emit('apiSay', options.to,
                        'Alias not found'
                    );
                }
            });
        }
    },
    alias: {
        level: 0,
        method: function alias(options) {
            User.findByOptions(options, function (err, doc) {
                if (err) console.log(err);
                if (doc) {
                    var aliases = _(doc.aliases).map(function (item) {
                        return item.alias;
                    }).pull(doc.nick)
                        .value();
                    events.emit('apiSay', options.to,
                        "Aliases for " + doc.nick + " are: " + aliases.join(", ")
                    );
                } else {
                    events.emit('apiSay', options.to,
                        "No user found."
                    );
                }
            });
        }
    },
    ban: {
        level: 4,
        /**
         * ban Sets flag or tells ban status.
         * @param  {Object} options Object options passed from user function
         * @return {Boolean}         Sets isBanned flag depending on
         */
        method: function ban(options) {
            User.findByOptions(options, function (err, doc) {
                if (err) console.log(err);
                if (doc) {
                    if (!options.body) {
                        events.emit('apiSay', options.to,
                            'Ban takes one of available arguments:' +
                            ' false, true, status');
                    } else {
                        PRIVATE.ban[options.body] ?
                            PRIVATE.ban[options.body](doc, options.to) :
                            events.emit('apiSay', options.to,
                                "Command not found. ");
                    }
                } else {
                    events.emit('apiSay', options.to,
                        "User wasn't specified.");
                }
            });
        }
    }
};

/**
 * user - main method acting as a hub for all user API calls
 * @param  {Object} options Options object always returned on API call
 * -       {String} to      Channel or user to which the API should respond
 * -       {String} from    User who made the API call
 * -       {String} message Parsed message without the command
 * @return {Emitter}        Returns an event when function's finished for parsing
 */
var method = function user(options) {
    var splitted = _.pull(options.message.split(" "), "");
    var len = splitted.length;
    var command = splitted[0];
    var nick = len >= 2 ? splitted[1].toLowerCase() : "";
    var body = len >= 3 ? splitted.slice(2, len).join(" ") : "";

    User.findOne({
        nick: options.from
    }, function (err, doc) {
        if (err) console.log(err);
        var currentCommand = command ? COMMANDS[command] : COMMANDS.list;
        if (currentCommand && doc && doc.permissions.level >= currentCommand.level) {
            currentCommand.method({
                to: options.to,
                from: options.from,
                nick: nick,
                body: body.trim(),
                alias: body.trim().split(' ')[0],
                doc: doc
            });
        } else if (doc.permissions.level < currentCommand.level) {
            events.emit(options.to, "Access denied. Your permissions level " +
                doc.permissions.level + " < " + currentCommand.level
            );
        } else {
            COMMANDS.list.method(options.to);
        }
    });
};

var defaults = {
    description: {
        pl: ",user [komenda] [nick] - Zwraca [komenda] dla [nick]",
        en: ",user [komenda] [nick] - Returns [command] for [nick]"
    },
    aliases: [],
    level: 0
};


module.exports = {
    method: method,
    defaults: defaults
};