"use strict";
var _ = require('lodash'),
    methods = require('./index.js');

var method = function list(options) {
    var commands = "";

    _.forEach(methods, function (property, key) {
        commands = commands + key + " ";
    });

    return {
        type: "say",
        to: options.to,
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