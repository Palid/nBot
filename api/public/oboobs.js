'use strict';
var util = require('util');
var _ = require('lodash');
var request = require('request');
var rek = require('rekuire');
var events = rek('/bot.js').events,
  defUrl = 'http://api.oboobs.ru/noise/',
  requestOptions = {
    method: 'GET'
  };

function validateAndFormatLink(link) {
  var url;
  // new API
  if (_.isObject(link)) {
    url = link.id.toString();
  } else {
    // old API
    url = link.toString();
  }
  while (url.length < 5) {
    url = '0' + url;
  }

  return url;
}

var method = function oBoobsApi(options) {
  var channel = options.to,
    msg = parseInt(options.message, 10),
    data = (!_.isNaN(msg) && msg <= 5) ? msg : 1;

  var r = request(defUrl + data, requestOptions, function (err, response, body) {
    if (err) {
      console.log(err);
      r.abort();
      events.emit('apiSay', channel, "Something's wrong with api.oboobs.ru.");
    }
    var parsed, resp;
    try {
      parsed = JSON.parse(body);
    } catch (err) {
      console.log(err);
    }
    if (parsed) {
      resp = _.map(parsed, function (item) {
        return util.format('http://media.oboobs.ru/noise/%s.jpg', validateAndFormatLink(item));
      });
      events.emit('apiSay', channel, resp);
    } else {
      events.emit('apiSay', channel, "Couldn't parse received JSON.");
    }
  });
};

var defaults = {
  description: {
    pl: ',oboobs [liczba <= 5] - Zwraca [liczba] zdjęć cycków.. Używa http://api.oboobs.ru/',
    en: ',oboobs [number <= 5] - Returns [amount] of boobies photos. Uses http://api.oboobs.ru/'
  },
  aliases: [
    'boobs',
    'cycki',
    'boobies',
    'tits'
  ]
};

module.exports = {
  method: method,
  defaults: defaults
};
