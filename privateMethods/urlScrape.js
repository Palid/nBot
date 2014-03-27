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

function getTitle(channel, url, data) {
    var $ = cheerio.load(data),
        title = $('title').text().replace(/\r?\n|\r/g, '');

    client.say(channel, '↳ title: ' + (title = (title.length <= 80) ? title : (title.substr(0, 79)) + '...'));
}

function method(commandGiver, channel, data) {

    var match = data.match(re);
    if (match) {
        var url = match[0],
            buffer = 0;
        url = url.search('www.') ? url : url.replace('www.', 'http://');

        var r = request(url, function (err, resp, body) {
            if (!err) {
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