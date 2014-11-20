"use strict";
var util = require('util');

var _ = require('lodash');
var rek = require('rekuire');
var mongoose = require('mongoose');
var DadJoke = mongoose.model('DadJoke');

var bot = rek('/bot.js');
var events = bot.events;

var common = require('./__dramaCommon.js');

var dadJokesAmount;

function setJokesAmount() {
    DadJoke.find({})
        .exec()
        .then(function (doc) {
            dadJokesAmount = doc.length;
        });
}

setJokesAmount();

var availableCommands = {
    add: function(options){
        options.Model = DadJoke;
        options.emitOnSuccess  = 'Dad joke added!';
        common.add(options);
    },
    dodaj: function (options) {
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
    DadJoke.findOne({
        jokeNumber: options.message
    }, function (err, doc) {
        if (err) {
            console.log(err);
            events.emit("apiSay", options.to, err.message);
        } else if (doc) {
            if (!doc.global) {
                events.emit("apiSay", options.to, util.format("[%s][%s]%s", doc.channel, options.message, doc.joke));
            } else {
                events.emit("apiSay", options.to, util.format("[%s][%s]%s", "g", options.message, doc.joke));
            }
        } else {
            events.emit("apiSay", options.to, util.format("There are only %s dad jokes in database available for [%s]. Specify lower number.", doc.length, options.to));
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
