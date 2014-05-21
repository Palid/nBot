"use strict";
var _ = require('lodash'),
    events = require('../../core/events.js'),
    commands = [],
    methods;

events.once('apiLoaded', function (data) {
    methods = data;

    _.forEach(methods, function (property, key) {
        commands.push(key);
    });
});

var method = function list(options) {


    events.emit('apiSay', options.to, "Available commands: " + commands.join(" "));

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