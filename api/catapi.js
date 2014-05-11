"use strict";
var request = require('request'),
    client = require('../config/bot.js'),
    url = "http://thecatapi.com/api/images/get",
    requestOptions = {
        method: 'HEAD'
    };

var method = function catsApi(options) {
    var channel = options.to;

    var r = request(url, requestOptions, function (err, response, body) {
        if (err) {
            console.log(err);
            r.abort();
            client.say(channel, "Something's wrong with CatAPI");
        }
        client.say(channel, response.request.uri.href);
        r.abort();
    });

    return {
        type: "async"
    };
};

var defaults = {
    description: {
        pl: ",cats - Zwraca losowe zdjęcia kotka.",
        en: ",cats - Returns a random kitten photo."
    },
    aliases: [
        "cat",
        "cats",
        "kotki",
        "koty",
        "kot"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};