"use strict";
var path = require('path'),
    _ = require('lodash'),
    request = require('request'),
    rootDir = path.dirname(require.main.filename),
    logger = require(rootDir + '/helpers/log.js'),
    client = require(rootDir + '/core/bot.js'),
    db = require(rootDir + '/core/initialize/database/index.js'),
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
        logger({
            timeStamp: true,
            fileName: 'urls/' + channel,
            data: str + '\r\n'
        });
        client.say(channel, scrapeTitle +
            (str = (str.length <= 80) ?
                str :
                (str.substr(0, (80 - titleStringLen - 3))) + '...')
        );
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
            "Link was just posted " +
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
            www = link.search('www.'),
            http = link.search('http://'),
            https = link.search('https://'),
            buffer = 0,
            url;


        if (!www) {
            url = link.replace('www.', 'http://');
        } else if (http === -1 && https) {
            url = 'http://' + link;
        } else {
            url = link;
        }
        // console.log('www: %s, http: %s, https: %s', www, http, https);
        // console.log(url);

        saveToDatabase(from, channel, data, url);
        var r = request(url, function (err, resp) {
            console.log(url);
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