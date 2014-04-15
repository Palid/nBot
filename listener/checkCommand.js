"use strict";
var _ = require('lodash'),
    watch = require('../initialize/watch.js'),
    client = require('../config/bot.js'),
    hotLoad = require('../helpers/hotload.js'),
    aliases = require('../initialize/createAliasDict.js');

watch.on('configChanged', function () {
    aliases = hotLoad(__dirname, '../initialize/createAliasDict.js');
});

var RESPONSES = {
    async: function () {
        // Do nothing, it's a fallback.
        // It's bad.
        // Terribad.
        // ▄███▄░░▄███▄░░████▄░████▄░██▄░░▄██
        // ▀█▄▀▀░██▀░▀██░██░██░██░██░░▀████▀░
        // ▄▄▀█▄░██▄░▄██░████▀░████▀░░░░██░░░
        // ▀███▀░░▀███▀░░██░██░██░██░░░░██░░░
        return;
    },
    command: function (response) {
        var nickBool = !! response.nick,
            messageBool = !! response.message;
        if (nickBool && messageBool) {
            return client.send(response.command, response.to, response.nick, response.message);
        } else if (messageBool) {
            return client.send(response.command, response.to, response.message);
        } else {
            return client.send(response.command, response.to, response.nick);
        }
    },
    say: function (response) {
        return client.say(response.to, response.message);
    }
};

function method(from, to, message) {

    console.log(from);
    console.log(to);
    console.log(message);

    if (message.charAt(0) === client.options.commandCharacter) {
        message = message.replace(client.options.commandCharacter, '');
        var firstWhitespace = _.indexOf(message, ' '),
            body = (firstWhitespace !== -1) ? message.substring(firstWhitespace + 1) : "",
            command = (firstWhitespace !== -1) ? message.substring(0, firstWhitespace) : message;

        if (_.isUndefined(aliases[command])) {
            client.say(to, "Command " + command + " not found");
        } else {
            try {
                var response, options,
                    isFunction = _.isFunction(aliases[command]);
                if (!isFunction) {
                    options = aliases[command].options;
                    from = _.isUndefined(options.from) ? from : options.from;
                    to = _.isUndefined(options.to) ? to : options.to;
                    body = _.isUndefined(options.data) ? body : options.data;
                }
                if (to === client.nick) {
                    if (!isFunction) {
                        response = aliases[command].method(from, body, to);
                    } else {
                        response = aliases[command](from, body, to);
                    }

                } else {
                    if (!isFunction) {
                        response = aliases[command].method(to, body, from);
                    } else {
                        response = aliases[command](to, body, from);
                    }

                }
                RESPONSES[response.type](response);

            } catch (err) {
                console.log(err);
                client.say(to, "Command " + command + " exited with an error.");
            }
        }

    }
}

module.exports = method;