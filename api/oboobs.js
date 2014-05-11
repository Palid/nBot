"use strict";
var _ = require('lodash'),
    request = require('request'),
    client = require('../config/bot.js'),
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
            client.say(channel, "Something's wrong with api.oboobs.ru.");
        }

        try {
            var parsed = JSON.parse(body);
            _.forEach(parsed, function (property) {
                client.say(channel, "http://media.oboobs.ru/noise/" + property.id + ".jpg");
            });
        } catch (err) {
            console.log(err);
            client.say(channel, "Couldn't parse received JSON.");
        }

    });

    return {
        type: "async"
    };
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