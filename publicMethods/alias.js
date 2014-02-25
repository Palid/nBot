"use strict";
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    irc = require('irc'),
    client = require('../config/bot.js'),
    bot = require('../privateMethods/');

var method = function (channel, data) {
    // Gotta require it in method, otherwise it's loaded globally.
    // Bad, bad things happen then...
    var parsed = bot.readConfig;

    if (_.has(parsed, data)) {
        var list = "";
        _.forEach(parsed[data].aliases, function (alias, iterator) {
            list = list + (client.commandCharacter + alias + " ");
        });
        return client.say(channel, "Aliases for " + data + " are: " + list);

    } else {
        return client.say(channel, "Command not found.");
    }

};

var defaults = {
    description: {
        pl: ",alias [cmd]- Wyświetla listę aliasów dla komendy.",
        en: ",alias [cmd]- Lists all aliases for command."
    },
    aliases: [
        "aliases"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};