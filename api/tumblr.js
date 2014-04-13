"use strict";
var _ = require('lodash'),
    client = require('../config/bot.js'),
    tumblr = require('tumblr'),
    oauth = require('../config/oAuth.js').tumblr,
    tagged = new tumblr.Tagged(oauth);

function getRandomPoster(response) {
    return Math.floor(Math.random() * response.length);
}

function method(channel, data) {

    tagged.search(data, function (err, response) {

        if (err) {
            return console.log(err);
        }

        if (response.length) {
            var photos = response[getRandomPoster(response)].photos,
                photoList = photos.length >= 1 ? photos[0].original_size : photos,
                url = photoList.url,
                width = photoList.width,
                height = photoList.height;

            return client.say(channel, url);
        } else {
            return client.say(channel, 'Tag not found.');
        }

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