'use strict';
//util
var util = require('util');
var _ = require('lodash');
var rek = require('rekuire');
var Entities = require('html-entities').XmlEntities,
  entities = new Entities();

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
  title = entities.decode(title.trim()).replace(/[\r\n]/g, ' ');
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
    var formattedTitle;
    if (err) {
      console.log(err);
    } else if (!doc) {
      formattedTitle = formatTitle(title);
      Link.create({
        channel: channel,
        count: 1,
        lastPost: {
          date: Date.now(),
          by: from
        },
        link: link,
        lastTitle: formattedTitle,
        firstPost: {
          by: from,
          date: Date.now()
        }
      }, function (err) {
        if (err) console.log(err);
      });

      events.emit('apiSay', channel,
                urlScrapeTitle.begin +
                formattedTitle
            );
    } else {
      formattedTitle = formatTitle(title, title);
      logger({
        timeStamp: true,
        fileName: 'urls/' + channel,
        data: link
      });
      events.emit('apiSay', channel,
                util.format('%s %s [%s] first: %s, title: %s',
                    urlScrapeTitle.begin, urlScrapeTitle.repost, doc.count, (doc.firstPost.by.substr(0, 1) + '\u200B' + doc.firstPost.by.substr(1)),
                    formattedTitle
                )
            );
      Link.update({
        _id: doc._id
      }, {
        count: doc.count + 1,
        lastPost: {
          date: Date.now(),
          by: from
        },
        lastTitle: formattedTitle
      }, function (err) {
        if (err) console.log(err);
      });
    }
  });
}

var scrapeStatus = {
  queue: [],
  isPending: false
};

function doRequest(url) {
  var r = request({
    url: url,
    headers: {
      'User-Agent': '(nBot)' + bot.getConfig('nick') + ' autoTitle',
      'Content-Type': 'text/plain'
    }
  }, function (err, resp) {
    if (err) {
      console.log(err);
      scrapeStatus.isPending = false;
    } else if (resp.headers['content-type'] && resp.headers['content-type'].search('text/html') === -1) {
      r.abort();
      scrapeStatus.isPending = false;
    }
  });
  return r;
}

function abortRequest(req, from, channel) {
  req.abort();
  scrapeStatus.isPending = false;
  initiateScraping(from, channel);
}

function setListener(req, from, channel, url) {
  var buffer = 0;
  req.on('data', function (chunk) {
    buffer += chunk;
    var str = chunk.toString(),
      match = titleRe.exec(str);
    if (match && match[2]) {
      if (match[2].replace(/\s/, '').length > 0) {
        saveToDatabase(from, channel, url, match[2]);
      }
      abortRequest(req, from, channel);
    }
    if (buffer.length > (20480)) {
      console.log('Buffer was too long, aborted!');
      abortRequest(req, from, channel);
    }
  });
  setTimeout(function() {
    abortRequest(req, from, channel);
  }, 3000);
}

function initiateScraping(from, channel) {
  if (!scrapeStatus.isPending && (scrapeStatus.queue.length >= 1)) {
    scrapeStatus.isPending = true;
    var url = scrapeStatus.queue.shift(),
      r = doRequest(url);
    setListener(r, from, channel, url);
  }
}

function method(from, channel, data, match) {
  if (match) {
    var link = match[0],
      url;

    if (!link.search('www.')) {
      url = link.replace('www.', 'http://');
    } else if (link.search('http://') === -1 && link.search('https://')) {
      url = 'http://' + link;
    } else {
      url = link;
    }

    scrapeStatus.queue.push(url);
    initiateScraping(from, channel);
  }
}

module.exports = {
  method: method,
  messageRe: /^(((http|https)\:\/\/)|(www\.))([a-z0-9]+\.)+[a-z]{2,63}$/i
};
