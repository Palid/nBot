"use strict";
var _ = require('lodash'),
    db = require('./db.js');

var GETTERS = {
    channel: function (options) {
        if (options) {
            if (!_.isObject(options)) {
                return db.channels[options];
            } else {
                return db.channels[options.to];
            }
        } else return db.channels;
    },
    channelUser: function (options) {
        var channel = db.channels[options.to];
        if (options) {
            return channel.users[options.from];
        } else return channel.users;
    },
    channelLink: function (options) {
        var channel = db.channels[options.to];
        if (options) {
            return channel.links[options.link];
        } else return channel.links;
    },
    user: function (options) {
        if (options) return db.users[options];
        else return db.users;
    }
};

module.exports = function Getter(getter, options) {
    return GETTERS[getter](options);
};