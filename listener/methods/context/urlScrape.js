"use strict";
var _ = require('lodash'),
    path = require('path'),
    request = require('request'),
    mongoose = require('mongoose'),
    Link = mongoose.model('Link'),
    rootDir = path.dirname(require.main.filename),
    logger = require(rootDir + '/helpers/log.js'),
    config = require(rootDir + '/config/bot.js'),
    events = require(rootDir + '/core/events.js'),
    titleStringLen = config.options.urlScrapeTitle.length,
    titleRe = new RegExp(/(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g);

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
    var lastSlash = _.lastIndexOf(link, '/');

    if (lastSlash === link.length - 1) {
        link = link.substr(0, lastSlash);
    }

    link = link.replace('https://', 'http://');

    Link.findOne({
        link: link,
        channel: channel
    }, function (err, doc) {
        if (err) {
            console.log(err);
        }
        if (!doc) {
            new Link({
                channel: channel,
                count: 1,
                lastPost: {
                    date: Date.now(),
                    by: from
                },
                link: link,
                firstPost: {
                    by: from,
                    date: Date.now()
                }
            }).save();

        } else {
            var response = [
                [
                    "Link was posted",
                    doc.count > 1 ? doc.count + " times" : "once"
                ].join(" "), [
                    "Last by",
                    doc.lastPost.by,
                    "on:",
                    doc.lastPost.date
                ].join(" "), [
                    "Originally by",
                    doc.firstPost.by,
                    "on:",
                    doc.firstPost.date
                ].join(" ")
            ];
            events.emit('apiSay', channel, response);
            Link.update({
                link: link
            }, {
                count: doc.count + 1,
                lastPost: {
                    date: Date.now(),
                    by: from
                }
            }, function (err) {
                if (err) console.log(err);
            });
        }

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
                match = titleRe.exec(str);
            if (match && match[2]) {
                if (match[2].replace(/\s/, '').length > 0) {
                    getTitle(channel, match[2]);
                    saveToDatabase(from, channel, url);
                }
                r.abort();
            }
            if (buffer.length > (20480)) {
                console.log("Buffer was too long, aborted!");
                r.abort();
            }
        });
    }
}

module.exports = method;