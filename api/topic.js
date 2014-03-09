"use strict";

var method = function (channel, topic) {
    return {
        type: "command",
        to: channel,
        message: topic
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