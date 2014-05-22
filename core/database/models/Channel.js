"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var channel = new Schema({
    channel: String,
    count: Number,
    lastPost: Date,
    link: String,
    firstPost: {
        by: String,
        date: {
            type: Date,
            default: Date.now
        }
    }
});

module.exports = mongoose.model('Channel', channel);