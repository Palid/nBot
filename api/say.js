"use strict";

var method = function say(options) {
    var channel = options.to,
        data = options.message;
    return {
        type: "say",
        to: channel,
        message: data
    };
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