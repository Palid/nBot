"use strict";
var request = require('request'),
    events = require('../helpers/events.js');

var requestOptions = {
    method: 'GET'
};

var method = function niggrUrlShortener(options) {
    var url = 'http://nig.gr/src/web/api/' + options.message.trim();

    console.log(url);

    request(url, requestOptions, function (err, res, body) {
        var shortened = 'http://nig.gr/' + body;
        if (err) {
            console.log(err);
            events.emit("apiSay", options.to, err);
        } else {
            events.emit("apiSay", options.to, shortened);
        }
    });

};

var defaults = {
    description: {
        pl: ",nigrr [url] - Returns nig.gr shortened url",
        en: ",nigrr [url] - Returns nig.gr shortened url"
    },
    aliases: [
        "nigger",
        "nig"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};