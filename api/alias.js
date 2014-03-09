"use strict";
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    client = require('../config/bot.js'),
    config = require('../initialize/parseJSON.js');

var method = function (channel, data) {

    if (_.has(config, data)) {
        var list = "";
        _.forEach(config[data].aliases, function (alias, iterator) {
            list = list + (client.commandCharacter + alias + " ");
        });

        return {
            type: "say",
            to: channel,
            message: "Aliases for " + data + " are: " + list
        };
    } else {
        return {
            type: "say",
            to: channel,
            message: "Command not found."
        };
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