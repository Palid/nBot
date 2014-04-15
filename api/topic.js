"use strict";

var method = function topic(options) {
    var channel = options.to,
        data = options.message;
    return {
        type: "command",
        command: "TOPIC",
        to: channel,
        message: data
    };
};

var defaults = {
    description: {
        pl: ",topic [string] - Zmienia temat kanału na [string].",
        en: ",topic [string] - Changes channel topic to [string]."
    },
    aliases: [
        "t"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};