"use strict";
var _ = require('lodash'),
    figlet = require('figlet'),
    client = require('../config/bot.js');



var method = function shout(channel, data) {

    figlet(data, function (err, data) {
        if (err) {
            console.dir(err);
            return;
        }
        if (data.length > 500) {
            client.say(channel, "String is too long.");
        } else {
            client.say(channel, data);
        }
    });

    return {
        type: "async"
    };

};

var defaults = {
    description: {
        pl: ",shout [string] - Bot wykrzykuje [string].",
        en: ",shout [string] - Bot shouts [string]."
    },
    aliases: []
};


module.exports = {
    method: method,
    defaults: defaults
};