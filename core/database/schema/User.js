var mongoose = require('../init.js'),
    config = require('../../../config/bot.js'),
    Schema = mongoose.Schema;

var user = new Schema({
    nick: String,
    preferences: {
        language: {
            type: String,
            default: "en"
        },
    },
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
            default: config.options.root
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

module.exports = mongoose.model('User', user);