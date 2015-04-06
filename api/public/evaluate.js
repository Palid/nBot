"use strict";
var child_process = require('child_process');
var rek = require('rekuire');
var events = rek('/bot.js').events;

var method = function evaluate(options) {
  var child = child_process.fork('__evaluate.js');

  child.once("message", function(evaledString) {
    clearTimeout(timer);
    child.kill("SIGHUP");
    events.emit('apiSay', options.to, evaledString);
  });

  var timer = setTimeout(function() {
    child.kill("SIGHUP");
    events.emit('apiSay', options.to, "Execution timed out.");
  }, 2000);


  child.send(options.message);
};

var defaults = {
  description: {
    pl: ",eval [argumenty] - Ewaluuje wyrażenie. Dostępny JSowy obiekt Math.",
    en: ",eval [arguments] - Evaluates the expression. Object Math is allowed."
  },
  aliases: [
    'maths',
    'math',
    'eval',
    'e',
    'count'
  ]
};


module.exports = {
  method: method,
  defaults: defaults
};
