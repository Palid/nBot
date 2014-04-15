"use strict";
var _ = require('lodash'),
    client = require('../config/bot.js'),
    oauth = require('../config/oAuth.js').tumblr,
    tumblr = require('tumblr'),
    tagged = new tumblr.Tagged(oauth);

function getRandomPoster(len) {
    return Math.floor(Math.random() * len);
}

var method = function tumblr(channel, data) {

    tagged.search(data, function (err, response) {
        var iterations = -1,
            len = response.length;
        if (err) {
            return console.log(err);
        }
        if (len > 1) {
            var photos = response[getRandomPoster(len)].photos,
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
                    photos = response[iterations].photos;
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
};

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