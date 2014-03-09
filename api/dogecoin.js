"use strict";
var _ = require('lodash'),
    request = require('request'),
    client = require('../config/bot.js');

var message,
    options = {
        url: 'https://www.coins-e.com/api/v2/markets/data/',
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/4.0 (compatible; Cryptsy API node client)",
            "Content-type": "application/x-www-form-urlencoded",
            "Host": "www.coins-e.com"
        }
    };


var method = function (channel, data) {

    request(options.url, options, function (err, res, body) {
        var response = JSON.parse(body);
        if (!err && response.message === 'success') {
            message = [
                "Dogecoin status:",
                "average: " + response.markets.DOGE_BTC.marketstat['24h'].avg_rate,
                "high: " + response.markets.DOGE_BTC.marketstat['24h'].h,
                "low: " + response.markets.DOGE_BTC.marketstat['24h'].l,
                "volume: " + response.markets.DOGE_BTC.marketstat['24h'].volume
            ];
            client.say(channel, message.join(" "));
        }
    });

    return {
        type: "async"
    };

};

var defaults = {
    description: {
        pl: ",dogecoin - Pokazuje aktualną cenę DogeCoinów.",
        en: ",dogecoin - Shows current DogeCoin price."
    },
    aliases: [
        "doge",
        "dge"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};