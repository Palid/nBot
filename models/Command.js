"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var command = new Schema({
    aliases: [{
        alias: {
            type: String,
            unique: true
        },
        options: {
            from: String,
            to: String,
            data: String
        }
    }],
    description: [{
        lang: String,
        description: String
    }],
    level: {
        type: Number,
        default: 0
    },
    command: String
});

mongoose.model('Command', command);