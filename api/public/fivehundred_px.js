"use strict";
var events = require('../../core/events.js'),
    oauth = require('../../config/oAuth.js')['500px'],
    API500px = require('500px').API500px,
    api500px = new API500px(oauth.consumer_key);

function getRandomPoster(len) {
    return Math.floor(Math.random() * len);
}

var method = function fivehundred_px(options) {
    var channel = options.to,
        data = options.message;

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
            events.emit('apiSay', channel, url);
        } else {
            events.emit('apiSay', channel, 'Images not found.');
        }
    });

    return {
        type: "async"
    };

};

var defaults = {
    description: {
        pl: ",500px [tag] - Bot pobiera losowy obrazek z [tag].",
        en: ",500px [tag] - Bot gets random [tag] image."
    },
    aliases: [
        '500',
        'px', {
            alias: 'nude',
            options: {
                data: 'nude'
            }
        }
    ]
};

module.exports = {
    method: method,
    defaults: defaults
};