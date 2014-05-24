"use strict";
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var events = require('../../../core/events.js');

var method = function sayMemo(from, to) {

    User.findOne({
        nick: from
    }, function (err, doc) {
        if (err) console.log(err);
        if (doc) {
            if (doc.memo.length > 0) {
                _.forEach(doc.memo, function (value) {
                    var memo = [
                        from + ":",
                        value.from,
                        "has left you a message on",
                        value.date + ".",
                        "Message:",
                        value.message,
                    ].join(" ");
                    events.emit('apiSay', to, memo);
                });
                doc.memo = [];
                doc.save();
            }
        }
    });
};

module.exports = method;