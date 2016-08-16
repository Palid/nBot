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
  const channel = options.to;
  const msg = parseInt(options.message, 10);
  const amount = (!_.isNaN(msg) && msg <= 5) ? msg : 1;

  var r = request(`${defUrl}${amount}`, requestOptions, function (err, response, body) {
    if (err) {
      console.log(err);
      r.abort();
      events.emit('apiSay', channel, "Something's wrong with api.oboobs.ru.");
    }
    var parsed;
    try {
      parsed = JSON.parse(body);
    } catch (parseError) {
      console.log(parseError);
    }
    if (parsed) {
      _.chain(parsed)
        .map(boobsObject => `http://media.oboobs.ru/noise/${validateAndFormatLink(boobsObject)}.jpg`)
        .forEach(url => {
          const req = request
            .head(url)
            .on('response', res => {
              if (res.statusCode === 200) {
                req.abort();
                events.emit('apiSay', channel, url);
              } else {
                method(options);
              }
            });
        }).value();
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
