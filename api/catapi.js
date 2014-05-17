"use strict";
var request = require('request'),
    events = require('../helpers/events.js'),
    url = "http://thecatapi.com/api/images/get",
    requestOptions = {
        method: 'HEAD'
    };

var method = function catsApi(options) {
    var channel = options.to;

    var r = request(url, requestOptions, function (err, response) {
        if (err) {
            console.log(err);
            r.abort();
            events.emit('apiSay', channel, "Something's wrong with CatAPI");
        }
        events.emit('apiSay', channel, response.request.uri.href);
        r.abort();
    });

    return {
        type: "async"
    };
};

var defaults = {
    description: {
        pl: ",catapi - Zwraca losowe zdjęcia kotka.",
        en: ",catapi - Returns a random kitten photo."
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