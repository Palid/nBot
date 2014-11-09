"use strict";
var util = require('util');

var _ = require('lodash');
var rek = require('rekuire');
var mongoose = require('mongoose');
var DadJoke = mongoose.model('DadJoke');

var bot = rek('/bot.js');
var events = bot.events;

var dadJokesAmount;

function setJokesAmount() {
    DadJoke.find({})
        .exec()
        .then(function (doc){
            dadJokesAmount = doc.length;
        });
}

setJokesAmount();

var availableCommands = {
    add: function add(options) {
        var globalFlag = options.message[0] === "global" ? true : false;
        if (options.message[0] === "global") {
            options.message.splice(0, 1);
        }
        console.log("Len: %s", dadJokesAmount);
        DadJoke.create({
            channel: options.to,
            addedBy: options.from,
            addDate: Date.now(),
            global: globalFlag,
            joke: options.message.join(" ").split("|"),
            jokeNumber: dadJokesAmount ? dadJokesAmount : 0
        }, function (err) {
            if (err) {
                console.log(err);
                events.emit("apiSay", options.to, err.message);
            } else {
                setJokesAmount();
                events.emit("apiSay", options.to, "Dad joke added!");
            }
        });
    },
    dodaj: function(options) {
        return availableCommands.add(options);
    }
    // TODO
    // list: function list(options) {
    //     var webserver = bot.getOption('webserver');
    //     events.emit("apiSay", options.to, util.format("All dramas are available at %s:%s/%s", webserver.url, webserver.port, options.to));
    // }
};

function getDadJoke(to) {
    DadJoke.findOne({
        jokeNumber: Math.floor(Math.random() * dadJokesAmount)
    }, function (err, doc) {
        console.log(doc);
        if (err) {
            console.log(err);
        } else {
            events.emit("apiSay", to, doc.joke ? doc.joke : 'No dad jokes!');
        }
    });
}

function getNthJoke(options) {
    DadJoke.find({
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
                events.emit("apiSay", options.to, util.format("There are only %s dad jokes in database available for [%s]. Specify lower number.", doc.length, options.to));
            }
        }
    });
}

var method = function dadJokeMain(options) {
    var message = options.message ? options.message.trim() : '';
    var split = message.split(' ');
    var command = split[0];
    var parsed = parseInt(command, 10);
    if (!_.isNaN(parsed)) {
        getNthJoke({
            to: options.to,
            from: options.from,
            message: parsed
        });
    } else if (message.length <= 0) {
        getDadJoke(options.to);
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
        pl: ",suchar - Bot opowiada losowego suchara",
        en: ",DadJoke - Bot says a dad joke"
    },
    aliases: [
        "suchar"
    ],
    level: 0
};


module.exports = {
    method: method,
    defaults: defaults
};
