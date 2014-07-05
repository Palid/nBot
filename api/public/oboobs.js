"use strict";
var _ = require('lodash');
var request = require('request');
var rek = require('rekuire');
var events = rek('/bot.js').events,
    defUrl = 'http://api.oboobs.ru/noise/',
    requestOptions = {
        method: 'GET'
    };

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

        try {
            var parsed = JSON.parse(body),
                resp = [];
            _.forEach(parsed, function (property) {
                var id = property.id.toString();
                while (id.length < 5) {
                    id = 0 + id;
                }
                resp.push(
                    "http://media.oboobs.ru/noise/" +
                    id +
                    ".jpg"
                );
            });
            events.emit('apiSay', channel, resp);
        } catch (err) {
            console.log(err);
            events.emit('apiSay', channel, "Couldn't parse received JSON.");
        }

    });
};

var defaults = {
    description: {
        pl: ",oboobs [liczba <= 5] - Zwraca [liczba] zdjęć cycków.. Używa http://api.oboobs.ru/",
        en: ",oboobs [number <= 5] - Returns [amount] of boobies photos. Uses http://api.oboobs.ru/"
    },
    aliases: [
        "boobs",
        "cycki",
        "boobies",
        "tits"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};