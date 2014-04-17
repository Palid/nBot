"use strict";
var _ = require('lodash'),
    cheerio = require('cheerio'),
    request = require('request'),
    client = require('../config/bot.js'),
    scrapeTitle = client.options.urlScrapeTitle,
    titleStringLen = scrapeTitle.length;

// This somehow fixes memory leaks...
// looks like a failed cookie, uh?
request = request.defaults({
    jar: request.jar()
});



function errors(err, channel) {
    if (err) {
        console.log(err);
    }
    // client.say(channel, "Couldn't get title.");
}

function getTitle(channel, url, data) {
    try {

        var $ = cheerio.load(data),
            title = $('title').text().replace(/[\r\n]/g, '');

        console.log(title);

        if (title.replace(/\s/, '').length > 0) {
            client.say(channel, scrapeTitle + (title = (title.length <= 80) ?
                title :
                (title.substr(0, (80 - titleStringLen - 3))) + '...'));
        } else {
            errors(null, channel);
        }

    } catch (err) {
        errors(err, channel);
    }

}

function method(from, channel, data) {

    var m = data.search('www.'),
        url = m !== -1 && !m ? data.replace('www.', 'http://') : data,
        buffer = 0;

    var r = request(url, function (err, resp, body) {
        if (err) {
            r.abort();
            errors(err, channel);
        } else if (resp.headers['content-type'].search('text/html') !== -1) {
            getTitle(channel, url, body);
        }
    });

    r.on('data', function (chunk) {
        buffer += chunk;
        if (buffer.length > (1024 * 1024 * 1.5)) {
            r.abort();
            // client.say(channel, "File too big. Aborting.");
        }
    });
}

module.exports = method;