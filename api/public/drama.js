"use strict";
var util = require('util');

var _ = require('lodash');
var rek = require('rekuire');
var mongoose = require('mongoose');
var Drama = mongoose.model('Drama');

var events = rek('/bot.js').events;


var availableCommands = {
    add: function add(options) {
        var globalFlag = options.message[0] === "global" ? true : false;
        if (options.message[0] === "global"){
            options.message.splice(0, 1);
        }
        Drama.create({
            channel: options.to,
            addedBy: options.from,
            addDate: Date.now(),
            global: globalFlag,
            dramaString: options.message.join(" ")
        }, function (err) {
            if (err) {
                console.log(err);
                events.emit("apiSay", options.to, err.message);
            } else {
                events.emit("apiSay", options.to, "drama-string added!");
            }
        });
    },
    list: function list(options) {
        Drama.find({
        $or: [{
            channel: options.to,

        }, {
            global: true
        }]
    },function (err, doc) {
            if (err) {
                console.log(err);
                events.emit("apiSay", options.to, err.message);
            } else {
                var list = _.map(doc, function (item) {
                    if (!item.global){
                        return util.format("[%s]%s", item.channel, item.dramaString);
                    } else {
                        return util.format("[%s]%s", "g", item.dramaString);
                    }
                });
                events.emit("apiSay", options.to, "Now listing every saved drama string:");
                events.emit("apiSay", options.to, list);
            }
        });
    }
};


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
        } else if (doc){
            events.emit("apiSay", to, doc[_.random(doc.length-1)].dramaString);
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
    if (message.length <= 0) {
        callDrama(options.to);
    } else if (availableCommands[command]) {
        split.splice(0, 1);
        availableCommands[command]({
            to: options.to,
            from: options.from,
            message: split
        });
    } else {
        events.emit("apiSay", options.to, Object.keys(availableCommands).join(" "));
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
