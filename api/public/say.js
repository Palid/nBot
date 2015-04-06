"use strict";
var rek = require('rekuire');
var events = rek('/bot.js').events;

var method = function say(options) {
    events.emit('apiSay', options.to, options.message);
};

var defaults = {
    description: {
        pl: ",say [string] - Bot wypowiada [string].",
        en: ",say [string] - Bot says [string]."
    },
    aliases: [
        "s"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};