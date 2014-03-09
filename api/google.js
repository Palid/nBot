"use strict";
var _ = require('lodash'),
    google = require('google'),
    client = require('../config/bot.js');


var method = function (channel, data) {
    // Links amount to display
    // per search
    google.resultsPerPage = 1;

    google(data, function (err, next, links) {
        if (err) {
            console.error(err);
        }

        var length = links.length;

        for (var i = 0; i < length; ++i) {
            var title = links[i].title.substring(0, 100) + "...",
                link = links[i].link,
                description = links[i].description.substring(0, 200) + "...",
                searchResult = "";

            if (_.isString(link)) {
                searchResult += link + " --- ";
            }

            if (_.isString(title)) {
                searchResult += title + " ";
            }

            if (_.isString(description)) {
                searchResult += "\r\n" + description;
            }

            return {
                type: "say",
                to: channel,
                message: searchResult
            };

        }

    });
};

var defaults = {
    description: {
        pl: ",google [string] - Wyświetla wynik wyszukiwania [string]",
        en: ",google [string] - Shows search result of [string]"
    },
    aliases: [
        "g",
        "szukaj"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};