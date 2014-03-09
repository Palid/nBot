"use strict";
var _ = require('lodash'),
    watch = require('../initialize/watch.js'),
    client = require('../config/bot.js'),
    hotLoad = require('./hotload.js'),
    aliases = require('../initialize/createAliasDict.js');

watch.on('configChanged', function () {
    aliases = hotLoad(__dirname, '../initialize/createAliasDict.js');
});

var method = function (from, to, message) {

    if (message.charAt(0) === client.commandCharacter) {
        message = message.replace(client.commandCharacter, '');
        var firstWhitespace = _.indexOf(message, ' '),
            body = (firstWhitespace !== -1) ? message.substring(firstWhitespace + 1) : "",
            command = (firstWhitespace !== -1) ? message.substring(0, firstWhitespace) : message;

        if (_.isUndefined(aliases[command])) {
            client.say(to, "Command " + command + " not found");
        } else {
            try {
                var response = aliases[command](to, body, from);

                if (response.type === "async") {
                    console.log("Waiting for response from " + command + " command");
                } else if (response.type === "command") {
                    if ( !! response.nick) {
                        client.send(response.command, response.to, response.nick, response.message);
                    } else {
                        client.send(response.command, response.to, response.message);
                    }
                } else if (response.type === "say") {
                    client.say(response.to, response.message);
                }

            } catch (err) {
                console.log(err);
                client.say(to, "Command " + command + " exited with an error.");
            }
        }

    }
};

module.exports = method;