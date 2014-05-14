"use strict";
var path = require('path'),
    _ = require('lodash'),
    rootDir = path.dirname(require.main.filename),
    events = require(rootDir + '/helpers/events.js'),
    client = require(rootDir + '/config/bot.js'),
    hotLoad = require(rootDir + '/helpers/hotload.js'),
    aliases = hotLoad(__dirname, rootDir + '/initialize/createAliasDict.js');

events.on('configChanged', function () {
    aliases = hotLoad(__dirname, rootDir + '/initialize/createAliasDict.js');
});

events.on('apiResponse', function (channel, message) {

    if (_.isArray(message)) {
        _.forEach(message, function (property) {
            client.say(channel, property);
        });
    } else {
        client.say(channel, message);
    }

});

var RESPONSES = {
    async: function () {
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
    var len = match[0].length,
        firstWhitespace = _.indexOf(message, ' '),
        body = (firstWhitespace !== -1) ?
            message.substring(firstWhitespace + len) :
            "",
        command = (firstWhitespace !== -1) ?
            message.substring(len, firstWhitespace) :
            message.substring(len);

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