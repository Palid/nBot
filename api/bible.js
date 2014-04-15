"use strict";
var request = require('request'),
    client = require('../config/bot.js');

var method = function bible(options) {
    var channel = options.to,
        data = options.message;

    var message,
        requestOptions = {
            url: "http://labs.bible.org/api/?passage=" + data + "&formatting=plain",
            method: 'GET',
        };

    request(requestOptions.url, requestOptions, function (err, res, body) {
        var response = body;
        message = body;
        if (err) {
            console.log(err);
            message = err;
        }
        client.say(channel, message);
    });

    return {
        type: "async"
    };
};

var defaults = {
    description: {
        pl: ",bible [data] - Pokazuje [data] z biblii. Używa https://labs.bible.org/api_web_service",
        en: ",bible [data] - Shows [data] from bible. Uses https://labs.bible.org/api_web_service"
    },
    aliases: [
        "godsays",
        "bug",
        "biblia"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};