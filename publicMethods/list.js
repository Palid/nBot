/*jslint node: true */
"use strict";
var irc = require('irc'),
    client = require('../config/bot.js'),
    methods = require('./index.js');

var method = function (channel) {
    var list = "";

    for (var property in methods) {
        list = list + (client.commandCharacter + property + " ");
    }
    return client.say(channel, "Available commands: " + list);
};

var defaults = {
    description: {
        pl: ",list - Wyświetla listę komend.",
        en: ",list - Lists all commands."
    },
    aliases: [
        "commands"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};