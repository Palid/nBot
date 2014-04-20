"use strict";
var _ = require('lodash'),
    watch = require('../initialize/watch.js'),
    client = require('../config/bot.js'),
    hotLoad = require('../helpers/hotload.js'),
    aliases = hotLoad(__dirname, '../initialize/createAliasDict.js');

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
        if (response.message.length > 300) {
            return client.say(response.to, "Response too long.");
        } else {
            return client.say(response.to, response.message);
        }
    }
};

// WARNING!
// Message starts substringing at 1, because
// the first symbol in the string is the client.commandCharacter

var method = function activateCommand(from, to, message) {
    var firstWhitespace = _.indexOf(message, ' '),
        body = (firstWhitespace !== -1) ? message.substring(firstWhitespace + 1) : "",
        command = (firstWhitespace !== -1) ? message.substring(1, firstWhitespace) : message.substring(1);

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

            if (!isFunction) {
                response = aliases[command].method({
                    from: from,
                    message: body,
                    to: to
                });
            } else {
                response = aliases[command]({
                    from: from,
                    message: body,
                    to: to
                });
            }

            RESPONSES[response.type](response);

        } catch (err) {
            console.log(err);
            client.say(to, "Command " + command + " exited with an error.");
        }
    }

};

module.exports = method;