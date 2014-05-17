"use strict";
var client = require('../config/bot.js');

function sayError(message) {
    var length = message.args.length;
    if (length === 4) {
        return client.say(message.args[2], message.args[1] + ' ' + message.args[length - 1]);
    }
}

module.exports = sayError;