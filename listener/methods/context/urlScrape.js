"use strict";
var path = require('path'),
    _ = require('lodash'),
    cheerio = require('cheerio'),
    request = require('request'),
    rootDir = path.dirname(require.main.filename),
    client = require(rootDir + '/config/bot.js'),
    db = require(rootDir + '/initialize/database/index.js'),
    scrapeTitle = client.options.urlScrapeTitle,
    titleStringLen = scrapeTitle.length;

// This somehow fixes memory leaks...
// looks like a failed cookie, uh?
request = request.defaults({
    jar: request.jar()
});


function errors(err, channel) {
    if (err) console.log(err);
}

function getTitle(channel, url, data) {
    try {
        var $ = cheerio.load(data),
            title = $('title').text().replace(/[\r\n]/g, '');

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
    var lastSlash = _.lastIndexOf(link, '/'),
        dbLink = db.get("channelLink", {
            to: channel,
            link: link
        });

    if (lastSlash === link.length - 1) {
        link = link.substr(0, lastSlash);
    }

    link = link.replace('https://', 'http://');

    if (!_.isObject(dbLink)) {
        db.set("link", {
            from: from,
            to: channel,
            link: link
        });
        dbLink = db.get("channelLink", {
            to: channel,
            link: link
        });
    } else {
        client.say(channel,
            "Link was already posted " +
            dbLink.count +
            " times."
        );
        client.say(channel,
            "Originally by: " +
            dbLink.firstPost.by +
            " on: " +
            dbLink.firstPost.date
        );
    }
    db.set("linkDate", {
        from: from,
        to: channel,
        link: link
    });
    db.set("linkCount", {
        from: from,
        to: channel,
        link: link,
        value: parseInt(dbLink.count, 10) + 1
    });
}

function method(from, channel, data, match) {

    if (match) {
        var link = match[0].toLowerCase(),
            m = link.search('www.'),
            url = m !== -1 && !m ? link.replace('www.', 'http://') : link,
            buffer = 0;

        saveToDatabase(from, channel, data, url);

        var r = request({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0'
            },
            url: url
        }, function (err, resp, body) {
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
            }
        });
    }
}

module.exports = method;