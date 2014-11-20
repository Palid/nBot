"use strict";
var util = require('util');

var _ = require('lodash');
var rek = require('rekuire');
var mongoose = require('mongoose');
var Drama = mongoose.model('Drama');

var bot = rek('/bot.js');
var events = bot.events;

var common = require('./__dramaCommon.js');

var availableCommands = {
    add: function(options){
        options.Model = Drama;
        options.emitOnSuccess = "drama-string added!";
        common(options);
    },
    list: function(options) {
        var webserver = bot.getOption('webserver');
        events.emit("apiSay", options.to, util.format("All dramas are available at %s:%s/%s", webserver.url, webserver.port, options.to));
    }
};


function getNthDrama(options) {
    Drama.find({
        $or: [{
            channel: options.to,

        }, {
            global: true
        }]
    }, function (err, doc) {
        if (err) {
            console.log(err);
            events.emit("apiSay", options.to, err.message);
        } else {
            if (doc.length >= options.message && options.message >= 0) {
                var nthItem = doc[options.message - 1];
                if (!nthItem.global) {
                    events.emit("apiSay", options.to, util.format("[%s][%s]%s", nthItem.channel, options.message, nthItem.dramaString));
                } else {
                    events.emit("apiSay", options.to, util.format("[%s][%s]%s", "g", options.message, nthItem.dramaString));
                }
            } else {
                events.emit("apiSay", options.to, util.format("There are only %s dramas in database available for [%s]. Specify lower number.", doc.length, options.to));
            }
        }
    });
}

function callDrama(to) {
    Drama.find({
        $or: [{
            channel: to,
        }, {
            global: true
        }]
    }, function (err, doc) {
        if (err) {
            console.log(err);
        } else if (doc) {
            events.emit("apiSay", to, doc[_.random(doc.length - 1)].dramaString);
        } else {
            events.emit("apiSay", to, doc.dramaString ? doc.dramaString : 'No dramas!');
        }
    });
}

/**
 * [method Your New API Function]
 * @param  {Object} options Options object always returned on API call
 * -       {String} to      Channel or user to which the API should respond
 * -       {String} from    User who made the API call
 * -       {String} message Parsed message without the command
 * @return {Emitter}        Returns an event when function's finished for parsing
 */
var method = function dramaMain(options) {
    var message = options.message ? options.message.trim() : '';
    var split = message.split(' ');
    var command = split[0];
    var parsed = parseInt(command, 10);
    if (!_.isNaN(parsed)) {
        getNthDrama({
            to: options.to,
            from: options.from,
            message: parsed
        });
    } else if (message.length <= 0) {
        callDrama(options.to);
    } else if (availableCommands[command]) {
        split.splice(0, 1);
        availableCommands[command]({
            to: options.to,
            from: options.from,
            message: split
        });
    } else {
        events.emit("apiSay", options.to, "Available sub-commands: " + Object.keys(availableCommands).join(" "));
    }
};

//
var defaults = {
    description: {
        pl: ",drama [komenda] - Zwraca losowy drama-string. Posiada trzy podkomendy: 'add','list",
        en: ",drama [command] - Returns random drama-string. Has three sub-commands: 'add', 'list'"
    },
    aliases: [
        "łiju",
    ],
    level: 0
};


module.exports = {
    method: method,
    defaults: defaults
};
