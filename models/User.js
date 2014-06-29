"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var user = new Schema({
    nick: {
        type: String,
        required: true,
        unique: true
    },
    preferences: {
        language: {
            type: String,
            default: "en"
        },
    },
    permissions: {
        level: {
            type: Number,
            required: true,
            max: 5,
            default: 0
        },
        isBanned: {
            type: Boolean,
            default: false
        }
    },
    aliases: [{
        alias: String,
        addedBy: String,
        date: {
            type: Date,
            default: Date.now()
        }
    }],
    seen: [{
        channel: String,
        date: {
            type: Date,
            default: Date.now()
        },
        message: String
    }],
    memo: [{
        from: String,
        message: String,
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

user.static('findUser', function (nickOrAlias, callback) {
    return this.findOne({
        $or: [{
            'aliases.alias': nickOrAlias
        }, {
            nick: nickOrAlias
        }]
    }, callback);
});

user.static('findByOptions', function (options, callback) {
    return this.findOne({
        $or: [{
            'aliases.alias': options.nick
        }, {
            'aliases.alias': options.alias
        }, {
            nick: options.alias
        }, {
            nick: options.nick
        }]
    }, callback);
});

user.static('createNew', function (nick, channel, callback) {
    return this.create({
        nick: nick
    }, callback);
});

mongoose.model('User', user);