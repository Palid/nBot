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
        var iterations = 0,
            len = response.length;
        if (err) {
            return console.log(err);
        }
        if (len > 1) {
            var photos = response[getRandomPoster(response)].photos,
                photosNotExist = _.isUndefined(photos);
            do {
                iterations++;
                if (!photosNotExist) {
                    var photoList = photos[0].original_size,
                        url = photoList.url,
                        width = photoList.width,
                        height = photoList.height;
                    client.say(channel, url);
                } else {
                    photos = response[getRandomPoster(response)].photos;
                    photosNotExist = _.isUndefined(photos);
                }
            }
            while (photosNotExist && iterations <= len);

        } else {
            return client.say(channel, 'Images not found.');
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