"use strict";
var _ = require('lodash');
var request = require('request');
var xml2js = require('xml2js').parseString;
var rek = require('rekuire');
var events = rek('/bot.js').events,
  url = "http://thecatapi.com/api/images/get?format=xml&results_per_page=";


function getKittenz(channel, formattedURL) {
  var r = request(formattedURL, function (err, response) {
    if (err) {
      console.log(err);
      r.abort();
      events.emit('apiSay', channel, "Something's wrong with CatAPI");
    }
    xml2js(response.body, function(err, result){
      if (err) console.log(err);
      _.forEach(result.response.data[0].images[0].image, function(imageObject) {
        events.emit('apiSay', channel, imageObject.url);
      });
      r.abort();
    });
  });
}

var method = function catsApi(options) {
  var channel = options.to,
    msg = parseInt(options.message, 10),
    data = (!_.isNaN(msg) && msg <= 5) ? msg : 1;

    var formattedURL = url + data;

    getKittenz(channel, formattedURL);
};

var defaults = {
  description: {
    pl: ",catapi - Zwraca losowe zdjęcia kotka.",
    en: ",catapi - Returns a random kitten photo."
  },
  aliases: [
    "cat",
    "cats",
    "kotki",
    "koty",
    "kot"
  ]
};


method({
  channel: '#nbot',
  message: 10
});

module.exports = {
  method: method,
  defaults: defaults
};
