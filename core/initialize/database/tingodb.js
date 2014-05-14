"use strict";
var Engine = require('tingodb')(),
    db = new Engine.Db('../../../tingodb', {}),
    tungus = require('tungus'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    client = require('../../config/bot.js');

mongoose.connect('tingodb://' + __dirname + '../../../tingodb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log("Connected!");
});

console.log('Running mongoose version %s', mongoose.version);

var user = new Schema({
    nick: String,
    permissions: {
        group: String,
        level: Number,
        api: {
            command: String,
            level: Number
        }
    },
    aliases: [{
        alias: String,
        addedBy: {
            type: String,
            default: client.options.root
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    seen: [{
        channel: String,
        date: Date
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

var User = mongoose.model('User', user);
var palid = new User({
    nick: 'palid',
    aliases: [{
        alias: 'phoelid'
    }],
    seen: [{
        channel: '#nBot',
        date: Date.now()
    }],
    memo: [{
        from: 'palid',
        message: 'testowanie'
    }]
});
palid.save(function (err, palid) {
    if (err) return console.log(err);
    console.log(palid);
});

User.find(function (err, users) {
    console.log(users);
});

var link = new Schema({
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