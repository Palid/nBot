"use strict";
var _ = require('lodash');
var rek = require('rekuire');
var bot = rek('/bot.js');
var getNewRandomText = rek('helpers/markovChains.js')(bot.getDictionary('##feminism').split('\n'));

var method = function feminismChannelOnFreenodeFtw(from, to, message) {
    if (_.random(0, 4) === 0) {
      bot.events.emit('apiSay', to, getNewRandomText(_.random(10, 20)));
    }
};

module.exports = {
    method: method,
    messageRe: /./g
};
