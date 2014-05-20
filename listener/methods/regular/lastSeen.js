"use strict";
var path = require('path'),
    rootDir = path.dirname(require.main.filename),
    db = require(rootDir + '/core/database/');

var method = function logLastActivity(from, to, message) {

    db.User.findOne({
        $and: [{
            nick: from
        }, {
            'seen.channel': to
        }]
    }, function (err, resp) {
        if (err) console.log(err);
        if (!resp || resp.length < 1) {
            db.User.update({
                nick: from
            }, {
                $set: {
                    nick: from
                },
                $addToSet: {
                    seen: {
                        channel: to,
                        date: Date.now(),
                        message: message
                    }
                },
            }, {
                upsert: true
            }, function (err) {
                if (err) console.log(err);
            });
        } else {
            db.User.update({
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