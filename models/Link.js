"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var link = new Schema({
    channel: {
      type: String,
      lowercase: true
    },
    count: Number,
    lastPost: {
        date: Date,
        by: String
    },
    link: {
        type: String,
        trim: true
    },
    lastTitle: {
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
