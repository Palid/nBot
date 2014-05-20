"use strict";
var mongoose = require('../config.js'),
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

var Model = mongoose.model('Channel', channel);

module.exports = Model;