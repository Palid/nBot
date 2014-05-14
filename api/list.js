"use strict";
var _ = require('lodash'),
    events = require('../helpers/events.js'),
    methods;

events.once('apiLoaded', function (data) {
    methods = data;
});

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