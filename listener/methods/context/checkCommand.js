"use strict";
var _ = require('lodash'),
    path = require('path'),
    rootDir = path.dirname(require.main.filename),
    events = require(rootDir + '/core/events.js'),
    client = require(rootDir + '/core/bot.js'),
    aliases = require(rootDir + '/core/initialize/createAliasDict.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');

function useApi(command, from, to, body) {
    try {
        if (command.options) {
            command.method({
                from: command.options.from ? command.options.from : from,
                to: command.options.to ? command.options.to : to,
                body: command.options.data ? command.options.data : body
            });
        } else {
            command.method({
                from: from,
                message: body,
                to: to
            });
        }
    } catch (err) {
        console.log(err);
        client.say(to, "Command " + command + " exited with an error.");
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
    var item = aliases[command];


    if (!item) {
        client.say(to, "Command " + command + " not found");
    } else {
        if (item.level > 0) {
            User.findOne({
                nick: from
            }, function (err, doc) {
                if (err) console.log(err);
                if (doc.permissions.level >= item.level) {
                    useApi(item, from, to, body);
                } else {
                    client.say(to, "Access denied. Your permissions level " +
                        doc.permissions.level + " < " + item.level
                    );
                }
            });
        } else {
            useApi(item, from, to, body);
        }

    }

};

module.exports = method;