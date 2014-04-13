"use strict";
var _ = require('lodash'),
    tumblr = require('tumblr'),
    oauth = require('../config/oAuth.js').tumblr,
    client = require('../config/bot.js');

function getRandomPoster(response) {
    return Math.floor(Math.random() * response.length);
}

function method(channel, data) {

    var tagged = new tumblr.Tagged(oauth);

    tagged.search(data, function (err, response) {
        if (err) {
            console.log(err);
        }
        // First
        var photos = response[getRandomPoster(response)].photos,
            photoList = photos.length >= 1 ? photos[0].original_size : photos,
            url = photoList.url,
            width = photoList.width,
            height = photoList.height;

        client.say(channel, url);

    });


    return {
        type: "async"
    };
}

//
var defaults = {
    description: {
        pl: ",tumblr [tag] - Bot pobiera losowy obrazek z [tag].",
        en: ",tumblr [tag] - Bot gets random [tag] image."
    },
    aliases: []
};

module.exports = {
    method: method,
    defaults: defaults
};