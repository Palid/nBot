"use strict";
var client = require('../config/bot.js'),
    methods = require('./index.js');

var method = function list(options) {
    var channel = options.to,
        commands = "";

    for (var property in methods) {
        commands = commands + (client.commandCharacter + property + " ");
    }

    return {
        type: "say",
        to: channel,
        message: "Available commands: " + commands
    };
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