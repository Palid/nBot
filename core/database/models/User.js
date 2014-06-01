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
        }
    },
    aliases: [{
        alias: {
            type: String
        },
        addedBy: {
            type: String,
        },
        date: {
            type: Date,
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

module.exports = mongoose.model('User', user);