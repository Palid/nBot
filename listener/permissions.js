"use strict";

var method = function nameYourFunctionForDebugging(options) {
    var to = options.to,
        message = options.message,
        from = options.from;

};

//
var defaults = {
    description: {
        pl: ",komenda [data] - Bot robi [data]",
        en: ",command [data] - Bot does [data]"
    },
    aliases: [
        "command",
        "yourOwn"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};