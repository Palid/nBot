"use strict";
var _ = require('lodash'),
    db = require('./db.js');

var PRIVATE = {
    _channel_users: function (from, to) {
        db.channels[to].users[from] = {};
    },
    _channel_users_aliases: function (from, to) {
        if (!_.isArray(db.channels[to].users[from].aliases))
            db.channels[to].users[from].aliases = [];
    },
    _channel_users_memo: function (from, to) {
        if (!_.isArray(db.channels[to].users[from].memo))
            db.channels[to].users[from].memo = [];
    },
    _channel_link: function (from, to, link) {
        db.channels[to].links[link] = {};
    },
    _channel_link_firstPost: function (from, to, link) {
        if (!_.isObject(db.channels[to].links[link].firstPost)) {
            db.channels[to].links[link].firstPost = {};
            db.channels[to].links[link].firstPost.by = from;
            db.channels[to].links[link].firstPost.date = new Date().toString();
            db.channels[to].links[link].count = 1;
        }
    },
};

var SETTERS = {
    seenCreate: function (options) {
        PRIVATE._channel_users(options.from, options.to);
        PRIVATE._channel_users_aliases(options.from, options.to);
        PRIVATE._channel_users_memo(options.from, options.to);
    },
    seen: function (options) {
        db.channels[options.to].users[options.from].seen = new Date().toString();
    },
    link: function (options) {
        PRIVATE._channel_link(options.from, options.to, options.link);
        PRIVATE._channel_link_firstPost(options.from, options.to, options.link);
    },
    linkDate: function (options) {
        db.channels[options.to].links[options.link].lastDate = new Date().toString();
    },
    linkCount: function (options) {
        db.channels[options.to].links[options.link].count = options.value;
    }
};

module.exports = function Setter(setter, options) {
    return SETTERS[setter](options);
};