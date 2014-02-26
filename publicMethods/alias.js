"use strict";
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    client = require('../config/bot.js'),
    config = require('../initialize/parseJSON.js');

var method = function (channel, data) {
    // Gotta require it in method, otherwise it's loaded globally.
    // Bad, bad things happen then...
    var parsed = config;

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