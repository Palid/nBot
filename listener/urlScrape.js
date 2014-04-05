"use strict";
var _ = require('lodash'),
    cheerio = require('cheerio'),
    request = require('request'),
    client = require('../config/bot.js'),
    re = require('../helpers/urlRe.js');

// This somehow fixes memory leaks...
// looks like a failed cookie, uh?
request = request.defaults({
    jar: request.jar()
});

function errors(err, channel) {
    console.log(err);
    client.say(channel, "Couldn't get title.");
}

function getTitle(channel, url, data) {
    try {

        var $ = cheerio.load(data),
            title = $('title').text(),
            re = title ? title.replace(/\r?\n|\r/g, '') : '';
        console.log("Title: " + title);
        console.log("reTitle: " + re);

        if (re.length > 0) {
            client.say(channel, '↳ title: ' + (title = (title.length <= 80) ?
                title :
                (title.substr(0, 79)) + '...'));
        }

    } catch (err) {
        errors(err, channel);
    }

}

function method(commandGiver, channel, data) {

    var match = data.match(re);
    if (match) {
        var url = _.indexOf(match[0], 'www') !== -1 ? match[0].replace('www', 'http://') : match[0],
            buffer = 0,
            r = request(url, function (err, resp, body) {
                if (err) {
                    r.abort();
                    errors(err, channel);
                } else {
                    getTitle(channel, url, body);
                }
            });

        r.on('data', function (chunk) {
            buffer += chunk;
            if (buffer.length > (1024 * 1024 * 1.5)) {
                r.abort();
                client.say(channel, "File too big. Aborting.");
            }
        });
    }
}


module.exports = method;