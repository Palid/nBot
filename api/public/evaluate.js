'use strict';
const path = require('path');
var childProcess = require('child_process');
var rek = require('rekuire');
var events = rek('/bot.js').events;

var method = function evaluate(options) {
  var child = childProcess.fork(path.resolve(__dirname, './__evaluate.js'));

  var timer = setTimeout(function() {
    child.kill('SIGHUP');
    events.emit('apiSay', options.to, 'Execution timed out.');
  }, 2000);

  child.once('message', function(evaledString) {
    clearTimeout(timer);
    child.kill('SIGHUP');
    events.emit('apiSay', options.to, evaledString);
  });


  child.send(options.message);
};

var defaults = {
  description: {
    pl: ',eval [argumenty] - Ewaluuje wyrażenie. Dostępny JSowy obiekt Math.',
    en: ',eval [arguments] - Evaluates the expression. Object Math is allowed.'
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
