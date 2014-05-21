"use strict";
var _ = require('lodash'),
    google = require('google'),
    events = require('../../core/events.js');

// Links amount to display
// per search
google.resultsPerPage = 1;

function nodeJSSaysHelloToRetardedLibraries(data, channel) {
    google(data, function (err, next, links) {
        if (err) {
            console.error(err);
        }

        for (var i = 0, length = links.length; i < length; ++i) {
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
            events.emit('apiSay', channel, searchResult);

        }

    });
}


var method = function google(options) {
    var channel = options.to,
        data = options.message;

    // NOW I can use the google function.
    // Guess what! It didn't work because some smartass decided
    // that sending function properties in an object
    // will CRASH the library throwing an exception.
    //  _    _  ___ _____
    // | |  | |/ _ \_   _|
    // | |  | / /_\ \| |
    // | |/\| |  _  || |
    // \  /\  / | | || |
    //  \/  \/\_| |_/\_/

    nodeJSSaysHelloToRetardedLibraries(data, channel);

    return {
        type: "async",
    };
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