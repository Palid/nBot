"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var drama = new Schema({
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
    dramaString: String
});

mongoose.model('Drama', drama);
