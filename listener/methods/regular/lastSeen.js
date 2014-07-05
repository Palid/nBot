"use strict";
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var method = function logLastActivity(from, to, message) {

    User.findOne({
        nick: from
    }, function (err, doc) {
        if (err) console.log(err);
        if (doc && doc.seen) {
            var channelIndex = _.findIndex(doc.seen, {
                channel: to
            });
            if (channelIndex !== -1) {
                doc.seen[channelIndex].message = message;
                doc.seen[channelIndex].date = Date.now();
                doc.save(function (err) {
                    if (err) console.log(err);
                });
            } else if (channelIndex === -1) {
                doc.seen.push({
                    channel: to,
                    message: message,
                    date: Date.now()
                });
                doc.save(function (err) {
                    if (err) console.log(err);
                });
            }
        } else if (!doc) {
            User.createNew(from, to, function (err, user) {
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