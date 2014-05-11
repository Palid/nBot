"use strict";
var path = require('path'),
    _ = require('lodash'),
    request = require('request'),
    rootDir = path.dirname(require.main.filename),
    client = require(rootDir + '/config/bot.js'),
    db = require(rootDir + '/initialize/database/index.js'),
    scrapeTitle = client.options.urlScrapeTitle,
    titleStringLen = scrapeTitle.length,
    re = new RegExp(/(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g);

// This somehow fixes memory leaks...
// looks like a failed cookie, uh?
request = request.defaults({
    jar: request.jar()
});


function errors(err, channel) {
    if (err) console.log(err);
}

function getTitle(channel, str) {
    if (str.replace(/\s/, '').length > 0) {
        client.say(channel, scrapeTitle + (str = (str.length <= 80) ?
            str :
            (str.substr(0, (80 - titleStringLen - 3))) + '...'));
    } else {
        errors(null, channel);
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
        var link = match[0],
            m = link.search('www.'),
            url = m !== -1 && !m ? link.replace('www.', 'http://') : link,
            buffer = 0;

        saveToDatabase(from, channel, data, url);
        console.log(url);
        console.log('https://www.youtube.com/watch?v=A381p_SAbq8');
        var r = request({
            url: url
        }, function (err, resp, body) {
            if (err) {
                errors(err, channel);
            } else if (resp.headers['content-type'].search('text/html') === -1) {
                r.abort();
            }
        });

        r.on('data', function (chunk) {
            buffer += chunk;
            var str = chunk.toString(),
                match = re.exec(str);
            if (match && match[2]) {
                getTitle(channel, match[2]);
                r.abort();
            }
            if (buffer.length > (10240)) {
                console.log("Buffer was too long, aborted!");
                r.abort();
            }
        });
    }
}

module.exports = method;