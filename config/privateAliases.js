/*jslint node: true */
"use strict";
var methods = require('../methods.js');

var aliases = {
    //ESPECIALLY FOR KENBO <3
    kkk: function (data, nick, channel) {
        return methods.kick("kenbo", "kenbo", channel);
    },
    sage: function (data, nick, channel) {
        return methods.kick(data, nick, channel);
    },
    kenbo: function (data, nick, channel) {
        return methods.kick(data, nick, channel);
    },
    wypierdalaj: function (data, nick, channel) {
        return methods.kick(data, nick, channel);
    },
    temat: function (topic, from, channel) {
        return methods.topic(channel, topic);
    },
    mow: function (data, nick, channel) {
        return methods.say(channel, data);
    },
    // shout
    krzycz: function (data, nick, channel) {
        return methods.shout(channel, data);
    }
};

module.exports = aliases;