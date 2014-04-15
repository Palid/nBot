"use strict";
var _ = require('lodash'),
    client = require('../config/bot.js'),
    oauth = require('../config/oAuth.js')['500px'],
    API500px = require('500px').API500px,
    api500px = new API500px(oauth.consumer_key);

function getRandomPoster(len) {
    return Math.floor(Math.random() * len);
}

var method = function fivehundred_px(channel, data) {

    api500px.photos.searchByTag(data, {
        image_size: 4
    }, function (err, results) {
        if (err) {
            return console.log(err);
        }
        var photos = results.photos,
            len = photos.length;
        if (len > 1) {
            var photo = photos[getRandomPoster(len)],
                url = photo.image_url,
                width = photo.width,
                height = photo.height;
            client.say(channel, url);
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
        pl: ",500px [tag] - Bot pobiera losowy obrazek z [tag].",
        en: ",500px [tag] - Bot gets random [tag] image."
    },
    aliases: [
        '500',
        'px', {
            alias: 'boobs',
            options: {
                data: 'boobs'
            }
        }, {
            alias: 'cats',
            options: {
                data: 'cat'
            }
        }
    ]
};

module.exports = {
    method: method,
    defaults: defaults
};