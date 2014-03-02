"use strict";
var _ = require('lodash'),
    client = require('../config/bot.js'),
    hotLoad = require('./hotload.js'),
    aliases = require('./watchFile.js').aliases;

var method = function (from, to, message) {

    console.log(aliases);

    if (message.charAt(0) === client.commandCharacter) {
        message = message.replace(client.commandCharacter, '');
        var firstWhitespace = _.indexOf(message, ' '),
            body = (firstWhitespace !== -1) ? message.substring(firstWhitespace + 1) : "",
            command = (firstWhitespace !== -1) ? message.substring(0, firstWhitespace) : message;

        if (_.isUndefined(aliases[command])) {
            client.say(to, "Command " + command + " not found");
        } else {
            try {
                aliases[command](to, body, from);
            } catch (err) {
                console.log(err);
                client.say(to, "Command " + command + " exited with an error.");
            }
        }

    }
};

module.exports = method;