/*jslint node: true */
"use strict";
var _ = require('lodash'),
    privateAliases = require('./config/privateAliases.js'),
    methods = require('./methods.js');


var aliases = {
    // kick
    kick: function (data, nick, channel) {
        return methods.kick(channel, data, nick);
    },
    k: function (data, nick, channel) {
        return methods.kick(channel, data, nick);
    },
    // topic
    topic: function (topic, from, channel) {
        return methods.topic(channel, topic);
    },
    t: function (topic, from, channel) {
        return methods.topic(channel, topic);
    },
    // say
    say: function (data, nick, channel) {
        return methods.say(channel, data);
    },
    // shout
    shout: function (data, nick, channel) {
        return methods.shout(channel, data);
    },
    // Message
    msg: function (data, nick, channel) {
        return methods.msg(channel, data);
    },
    to: function (data, nick, channel) {
        return methods.msg(channel, data);
    },
    //
    //google search
    google: function (data, nick, channel) {
        return methods.google(channel, data);
    },
    g: function (data, nick, channel) {
        return methods.google(channel, data);
    },
    // command list
    alias: function (data, nick, channel) {
        return methods.list(channel, this);
    },
    list: function (data, nick, channel) {
        return methods.list(channel, methods);
    },
    // Eval for maths
    eval: function (data, nick, channel) {
        return methods.evaluate(channel, data);
    },
    maths: function (data, nick, channel) {
        return methods.evaluate(channel, data);
    },
    invite: function (data, nick, channel) {
        return methods.invite(channel, data);
    },
    dice: function (data, nick, channel) {
        return methods.dice(channel, data);
    },
    d: function (data, nick, channel) {
        return methods.dice(channel, data);
    }
};

aliases.__proto__ = privateAliases;

module.exports = aliases;