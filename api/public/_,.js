"use strict";
var _ = require('lodash');
var rek = require('rekuire');
var events = rek('/bot.js').events;

var method = function sadFace(options) {
    var parsed = parseInt(options.message),
      sadFaceLen = _.isNaN(parsed) ? 1 : parsed,
      response = ",";
    while (response.length <= sadFaceLen) {
      response += "_";
    }
    response += ",";
    events.emit("apiSay", options.to, response);
};

//
var defaults = {
    description: {
        pl: ",_,",
        en: ",_,"
    },
    aliases: [],
    level: 0
};

method({
  message: "123",
  to: "#nbot"
});


module.exports = {
    method: method,
    defaults: defaults
};
