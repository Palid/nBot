"use strict";
var events = require('../../core/events.js');

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