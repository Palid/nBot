"use strict";
//util
var _ = require('lodash');

//paths
var path = require('path');
var rootDir = path.dirname(require.main.filename);

//nBot
var config = require(rootDir + '/config/bot.js');
var events = require(rootDir + '/core/events.js');
var logger = require(rootDir + '/helpers/log.js');


//database
var mongoose = require('mongoose');
var Link = mongoose.model('Link');

//API
var request = require('request');
var titleRe = new RegExp(/(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g);


// formatTitle private
var titleRepostLen = config.options.urlScrapeTitle.repost.length;
var length = (80 - config.options.urlScrapeTitle.begin.length - 3);

function formatTitle(title, isRepost) {
    return ((title.length <= 80) ? title :
        (title.substr(0,
            isRepost ?
            (length - titleRepostLen) :
            length
        )) + '...');
}


function saveToDatabase(from, channel, link, title) {
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

            events.emit('apiSay', channel,
                config.options.urlScrapeTitle.begin +
                formatTitle(title)
            );
        } else {
            events.emit('apiSay', channel,
                config.options.urlScrapeTitle.begin + " " +
                config.options.urlScrapeTitle.repost + " " + doc.count +
                " first: " + doc.firstPost.by + ", " +
                "title: " +
                formatTitle(title, true)
            );
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
    logger({
        timeStamp: true,
        fileName: 'urls/' + channel,
        data: title + '\r\n'
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
                    saveToDatabase(from, channel, url, match[2]);
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