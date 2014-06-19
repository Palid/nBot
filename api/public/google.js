"use strict";
var _ = require('lodash'),
    google = require('google'),
    events = require('../../core/events.js');

// Links amount to display
// per search
google.resultsPerPage = 1;

function nodeJSSaysHelloToRetardedLibraries(data, channel) {
    var searchResult = [];
    google(data, function (err, next, links) {
        if (err) {
            console.error(err);
        }

        for (var i = 0, length = links.length; i < length; ++i) {
            var link = links[i].link + " --- ",
                linkLen = link.length,
                title = links[i].title.substring(0, 100 - (linkLen + 3 + 2)) + "...",
                description = links[i].description.substring(0, 300 - (title.length + linkLen + 3 + 2)) + "...",
                result = [];

            if (_.isString(link)) {
                result.push(link.replace(/\r?\n/, ''));
            }
            if (_.isString(title)) {
                result.push(title.replace(/\r?\n/, ''));
            }
            if (_.isString(description)) {
                result.push(description.replace(/\r?\n/, ''));
            }

            searchResult.push(result.join(" "));

        }
        events.emit('apiSay', channel, searchResult);
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