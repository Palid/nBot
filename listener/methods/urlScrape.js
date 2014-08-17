"use strict";
//util
var _ = require('lodash');
var rek = require('rekuire');


//nBot
var bot = rek('/bot.js');
var events = bot.events;
var logger = rek('helpers/log.js');
var urlScrapeTitle = bot.getOption('urlScrapeTitle');


//database
var mongoose = require('mongoose');
var Link = mongoose.model('Link');

//API
var request = require('request');
var titleRe = new RegExp(/(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g);


// formatTitle private
var titleRepostLen = urlScrapeTitle.repost.length;
var length = (80 - urlScrapeTitle.begin.length - 3);

function formatTitle(title, isRepost) {
    title = _.unescape(title);
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
            }).save(function (err, product, numberAffected) {
                if (err) console.log(err);
            });

            events.emit('apiSay', channel,
                urlScrapeTitle.begin +
                formatTitle(title)
            );
        } else {
            logger({
                timeStamp: true,
                fileName: 'urls/' + channel + '\r\n',
                data: link
            });
            events.emit('apiSay', channel,
                urlScrapeTitle.begin + " " +
                urlScrapeTitle.repost + " [" + doc.count + "]" +
                " first: " +
                (doc.firstPost.by.substr(0, 1) + '\u200B' + doc.firstPost.by.substr(1))+
                ", " +
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

        var r = request({
            url: url,
            headers: {
                'User-Agent': '(nBot)' + bot.getConfig('nick') + " autoTitle",
                'Content-Type': 'text/plain'
            }
        }, function (err, resp) {
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

module.exports = {
    method: method,
    messageRe: /[-a-zA-Z0-9:_\+.~#?&//=]{1,256}\.[^@\ ][a-z]{1,12}\b(\/[-a-zA-Z0-9:%_\+.~#?&//=]*)?(:\d+)?/i
};
