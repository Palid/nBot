"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var dadJoke = new Schema({
    channel: {
      type: String,
      lowercase: true
    },
    addedBy: String,
    addDate: {
        type: Date,
        default: Date.now
    },
    global: Boolean,
    joke: [String],
    jokeNumber: Number
});

mongoose.model('DadJoke', dadJoke);
