/*jslint node: true */
"use strict";
var irc = require('irc'),
    client = require('../config/bot.js');


var method = function (channel, data) {
    var list = "";

    for (var property in data) {

        list = list + (client.commandCharacter + property + " ");
    }

    return client.say(channel, list);
};

var defaults = {
    description: {
        pl: ",list - Wyświetla listę komend.",
        eng: ",list - Lists all commands."
    },
    aliases: [
        "help",
        "commands"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};