"use strict";
var path = require('path'),
    _ = require('lodash'),
    request = require('request'),
    rootDir = path.dirname(require.main.filename),
    logger = require(rootDir + '/helpers/log.js'),
    config = require(rootDir + '/core/bot.js'),
    events = request(rootDir + 'core/events.js'),
    db = require(rootDir + '/core/initialize/database/index.js'),
    titleStringLen = config.options.urlScrapeTitle.length,
    re = new RegExp(/(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g);

// This somehow fixes memory leaks...
// looks like a failed cookie, uh?
request = request.defaults({
    jar: request.jar()
});

function getTitle(channel, str) {
    logger({
        timeStamp: true,
        fileName: 'urls/' + channel,
        data: str + '\r\n'
    });
    events.emit('apiSay', channel, config.options.urlScrapeTitle +
        (str = (str.length <= 80) ?
            str :
            (str.substr(0, (80 - titleStringLen - 3))) + '...')
    );
}


function saveToDatabase(from, channel, link) {
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
        var response = [
            [
                "Link was posted",
                dbLink.count > 1 ? dbLink.count + " times" : " once"
            ].join(" "), [
                "Originally by",
                dbLink.firstPost.by,
                "on:",
                dbLink.firstPost.date
            ].join(" ")
        ];
        events.emit('apiSay', channel, response);
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

        var r = request(url, function (err, resp) {
            if (err) {
                console.log(err);
            } else if (resp.headers['content-type'].search('text/html') === -1) {
                r.abort();
            }
        });

        r.on('data', function (chunk) {
            buffer += chunk;
            var str = chunk.toString(),
                match = re.exec(str);
            if (match && match[2]) {
                if (match[2].replace(/\s/, '').length > 0) {
                    getTitle(channel, match[2]);
                    saveToDatabase(from, channel, url);
                }
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