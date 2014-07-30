"use strict";
var _ = require('lodash');
var rek = require('rekuire');

var events = rek('/bot.js').events,
    client = rek('core/bot.js');

var API = rek('api');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Command = mongoose.model('Command');

function useApi(commandMap, from, to, body) {
    try {
        console.log(commandMap);
        if (commandMap.options) {
            API[commandMap.command].method({
                from: commandMap.options.from ? commandMap.options.from : from,
                to: commandMap.options.to ? commandMap.options.to : to,
                message: commandMap.options.data ? commandMap.options.data : body
            });
        } else {
            API[commandMap.command].method({
                from: from,
                message: body,
                to: to
            });
        }
    } catch (err) {
        console.log(err);
        client.say(to, "Command " + commandMap.command + " exited with an error.");
    }
}

events.on('apiSay', function (channel, message) {
    if (_.isArray(message)) {
        _.forEach(message, function (property) {
            client.say(channel, property);
        });
    } else {
        if (message.length > 300) {
            client.say(channel, "I don't want to flood the channel.");
        } else {
            client.say(channel, message);
        }

    }

});

events.on('apiCommand', function (response) {
    var nickBool = !! response.nick,
        messageBool = !! response.message;
    if (nickBool && messageBool) {
        return client.send(response.command, response.to, response.nick, response.message);
    } else if (messageBool) {
        return client.send(response.command, response.to, response.message);
    } else {
        return client.send(response.command, response.to, response.nick);
    }
});


/**
 * [activateCommand description]
 *
 * @param  {String} from - user from which the message was send
 * @param  {String} to - channel/user to which the message was send
 * @param  {String} message - message send
 * @param  {Array} match - result from RegExp.match()
 * @return {string} - may return an error
 */
var method = function activateCommand(from, to, message, match) {
    var splitted = _.pull(message.split(" "), "");
    var command = splitted[0].replace(match[0], '');
    var body = splitted.length >= 2 ? splitted.slice(1, splitted.length).join(" ") : "";

    Command.findOne({
        'aliases.alias': command,
    }).exec()
        .then(function (cmdDoc) {
            if (!cmdDoc) {
                client.say(to, "Command " + command + " not found");
            } else {
                var options = _.find(cmdDoc.aliases, function (item) {
                    return item.alias === command && (item.options.data || item.options.to || item.options.from);
                });
                var commandMap = {
                    command: cmdDoc.command,
                    options: options ? options.options : undefined
                };

                if (cmdDoc.level > 0) {
                    User.findOne({
                        nick: from
                    }, function (err, doc) {
                        if (err) console.log(err);
                        if (doc.permissions.level >= cmdDoc.level) {
                            useApi(commandMap, from, to, body);
                        } else {
                            client.say(to, "Access denied. Your permissions level " +
                                doc.permissions.level + " < " + cmdDoc.level
                            );
                        }
                    });
                } else {
                    useApi(commandMap, from, to, body);
                }

            }
        });
};

module.exports = method;