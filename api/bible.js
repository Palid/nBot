"use strict";
// var request = require('restler');
var request = require('request');

var method = function (channel, data) {
    var message,
        options = {
            url: "http://labs.bible.org/api/?passage=" + data + "&formatting=plain",
            method: 'GET',
        };

    request(options.url, options, function (err, res, body) {
        var response = body;
        console.log(body);
        message = body;
        if (err) {
            console.log(err);
            message = err;
        }
    });

    return {
        type: "say",
        to: channel,
        message: message
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