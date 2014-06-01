"use strict";
var mongoose = require('mongoose');
var User = mongoose.model('User');

var method = function logLastActivity(from, to, message) {

    User.findOne({
        $and: [{
            nick: from
        }, {
            'seen.channel': to
        }]
    }, function (err, doc) {
        if (err) console.log(err);
        if (!doc || doc.length < 1) {
            User.update({
                nick: from
            }, {
                $set: {
                    nick: from,
                },
                $addToSet: {
                    seen: {
                        channel: to,
                        date: Date.now(),
                        message: message ? message : ''
                    },
                    aliases: {
                        alias: from,
                        addedBy: 'seen',
                        date: Date.now()
                    }
                },
            }, {
                upsert: true
            }, function (err) {
                if (err) console.log(err);
            });
        } else {
            User.update({
                nick: from,
                'seen.channel': to
            }, {
                $set: {
                    "seen.$.message": message,
                    "seen.$.date": Date.now()
                }
            }, function (err) {
                if (err) console.log(err);
            });
        }
    });
};

module.exports = method;