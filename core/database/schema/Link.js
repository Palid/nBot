"use strict";
var mongoose = require('../init.js'),
    Schema = mongoose.Schema;


var link = new Schema({
    channel: String,
    count: Number,
    lastPost: Date,
    link: {
        type: String,
        unique: true
    },
    firstPost: {
        by: String,
        date: {
            type: Date,
            default: Date.now
        }
    }
});

var Model = mongoose.model('Link', link);

module.exports = Model;