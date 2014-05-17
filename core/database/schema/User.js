"use strict";
var mongoose = require('../init.js'),
    config = require('../../../config/bot.js'),
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
        group: {
            type: String,
            required: true
        },
        level: {
            default: 0,
            type: Number,
            required: true
        },
        api: {
            command: String,
            level: Number
        }
    },
    aliases: [{
        alias: {
            type: String
            // unique: true
        },
        addedBy: {
            type: String,
            // default: config.options.root
        },
        date: {
            type: Date,
            // default: Date.now
        }
    }],
    seen: [{
        channel: String,
        date: Date,
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

var Model = mongoose.model('User', user);

module.exports = Model;