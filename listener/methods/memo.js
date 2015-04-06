"use strict";
var util = require('util');
var _ = require('lodash');
var rek = require('rekuire');
var moment = require('moment');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var bot = rek('/bot.js');
var events = bot.events;

var method = function sayMemo(from, to) {
    User.findUser(from, function (err, doc) {
        if (err) console.log(err);
        if (doc) {
            var lang = doc.preferences.language || bot.getOption('defaultLang');
            if (doc.memo.length > 0) {
                _.forEach(doc.memo, function (value) {
                    var memo = util.format(bot.getDictionary('memo', lang).receive,
                        from, value.from, moment(value.date).lang(lang).fromNow(), value.message
                    );
                    events.emit('apiSay', to, memo);
                });
                doc.memo = [];
                doc.update();
            }
        }
    });
};

module.exports = {
    method: method,
    channelRe: /^(#|!|&)/g
};
