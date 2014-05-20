"use strict";
var mongoose = require('../config.js'),
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
            required: true,
            default: "guest"
        },
        level: {
            type: Number,
            required: true,
            default: 0
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