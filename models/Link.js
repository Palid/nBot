"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var link = new Schema({
    channel: String,
    count: Number,
    lastPost: {
        date: Date,
        by: String
    },
    link: {
        type: String,
        trim: true
    },
    firstPost: {
        by: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
});

mongoose.model('Link', link);