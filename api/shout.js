"use strict";

var method = function (channel, data) {
    return {
        type: "say",
        to: channel,
        message: data.toUpperCase()
    };
};

var defaults = {
    description: {
        pl: ",shout [string] - Bot wykrzykuje [string].",
        en: ",shout [string] - Bot shouts [string]."
    },
    aliases: []
};


module.exports = {
    method: method,
    defaults: defaults
};