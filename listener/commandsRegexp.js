'use strict';
const _ = require('lodash');
const rek = require('rekuire');
const loadDir = rek('helpers/loadDirectory.js');
// Regular methods which will fire every received message
const methods = loadDir('./methods', {
  currentDir: __dirname,
  type: '.js',
  recursive: false
});

const method = function regexStarter(from, to, message) {
  if (message) {
    _.forEach(methods, function (listenerObject, index) {
      var match;
      if (listenerObject.fnc) {
        listenerObject.fnc(from, to, message);
      } else if (listenerObject.messageRe) {
        match = message.match(listenerObject.messageRe);
        if (match) {
          listenerObject.method(from, to, message, match);
        }
      } else if (listenerObject.channelRe) {
        match = to.match(listenerObject.channelRe);
        if (match) {
          listenerObject.method(from, to, message, match);
        }
      } else {
        listenerObject.method(from, to, message);
      }
    });
  }
};
module.exports = method;
