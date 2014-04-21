"use strict";
var path = require('path'),
    _ = require('lodash'),
    cheerio = require('cheerio'),
    request = require('request'),
    rootDir = path.dirname(require.main.filename),
    client = require(rootDir + '/config/bot.js'),
    db = require(rootDir + '/initialize/db.js'),
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

function saveToDatabase(from, channel, data, link) {
    if (_.isUndefined(db[channel].links[link])) {
        db[channel].links[link] = {};
        if (_.isUndefined(db[channel].links[link].firstPost)) {
            db[channel].links[link].firstPost = [];
            db[channel].links[link].firstPost.by = from;
            db[channel].links[link].firstPost.date = new Date().toString();
        }
    } else {
        client.say(channel,
            "Link was already posted " +
            db[channel].links[link].count +
            " times."
        );
        client.say(channel,
            "Originally by: " +
            db[channel].links[link].firstPost.by +
            " on: " +
            db[channel].links[link].firstPost.date
        );
    }
    var count = db[channel].links[link].count;
    db[channel].links[link].lastDate = new Date().toString();
    db[channel].links[link].count = count ?
        parseInt(count, 10) + 1 :
        1;
}

function method(from, channel, data, match) {

    if (match) {
        var link = match[0];

        saveToDatabase(from, channel, data, link);

        var m = link.search('www.'),
            url = m !== -1 && !m ? link.replace('www.', 'http://') : link,
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
}

module.exports = method;